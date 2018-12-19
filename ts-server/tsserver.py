# -*- coding: utf-8 -*-
# pylint: disable=E0401

import json, sys, ast, os
from datetime import datetime
sys.path.insert(0, "python_packages")

import boto3

from zenpy import Zenpy
from zenpy.lib.api_objects import Ticket
from zenpy.lib.api_objects import User
from zenpy.lib.api_objects import Comment

print('Loading function')
dynamo = boto3.resource('dynamodb')
table = dynamo.Table("KESTroubleShooter")

operations = ['GET','POST','PUT']

def respond(err=None, res=None, zd_error=False):
    bodyJson = {"zd_error": zd_error}
    return {
        'statusCode': '400' if err else '200',
        'body': json.dumps({ 'error': str(err) } if err else bodyJson),
        'headers': {
            'Content-Type': 'application/json',
        },
        "isBase64Encoded": False,
    }

def updateDatabase(data, zendesk_ticket_id=None):
    item = {
        'SessionID': data["session_id"],
        'Answers': data["answers"],
        'Resolved': True if data["resolved"] is not None else False,
        'Updated' : str(datetime.now()),
    }
    # Add conditional items
    if data["jira_key"] is not None:
        item["JiraKey"] = data["jira_key"]
    if zendesk_ticket_id is not None:
        item["ZendeskTicketID"] = zendesk_ticket_id

    print("Item will be: " + json.dumps(item))

    try:
        response = table.put_item(Item=item)
    except Exception as err:
        raise err

    print(response)
    return response

def createTicket(data):
    
    # Zenpy accepts an API token
    creds = {
        'email' : os.environ.get('ZENDESK_EMAIL'),
        'token' : os.environ.get('ZENDESK_API_TOKEN'),
        'subdomain': 'kano'
    }
    zenpy_client = Zenpy(**creds)
    
    # @TODO
    # Check the database to see if the row for this session already has a zendesk 
    # ticket ID for this session. If it does, don't create new zendesk ticket!
    # We don't want duplicates
    
    # Grab the last terminal from the answers list, which should contain diagnostics
    terminal = data["answers"][-1]
    if "diagnosis" not in terminal:
        raise BaseException("data['answers'] object does not contain a well-formed terminal node")
    
    
    # @TODO 
    # Associate with the right product in ZenDesk
    # kit = getKitFromAnswers(data["answers"])
    
    # Create a Private Note Describing the Issue
    note = "This customer had an unresolved issue. They need your help!"
    note += "<h3>Summary</h3>"
    note += "<ul>"
    note += "<li><b>Diagnosis</b>: %s (Jira Issue <a href='https://kanocomputing.atlassian.net/browse/%s'>%s</a>)</li>" % (terminal["diagnosis"],terminal["jira_key"],terminal["jira_key"])
    note += "<li><b>Agent Solution</b>: %s</li>" % (terminal["agent_solution"])
    note += "<li><b>Solution Attempted By Customer (Unsuccessfully)</b>: %s</li>" % (terminal["customer_solution"])
    note += "</ul>"
    note += "<h3>Customer's Answers</h3>"
    note += "<ul>"
    for answer in data["answers"]:
        note += "<li>%s: %s</li>" %(answer["question"], "None Given" if "answer" not in answer else answer["answer"])
    note += "</ul>"

    # Create Ticket in Zendesk
    ticket = Ticket(
        requester = User(email=data["email"]),
        subject = "Troubleshooter: " + terminal["diagnosis"],
        tags = ["troubleshooter"],
        comment = Comment(html_body=note, public=False)
    )

    # audit = zenpy_client.tickets.create(ticket)
    
    # @TODO
    # Link with Jira Issue 
    # something like this: zenpy_client.jira_links.create()
    
    # @TODO
    # Specify the product

    # return audit.ticket.id
    return "newticket"


def getKitFromAnswers(answers):
    kit = answers[0]["answer"]
    if kit=="Computer Kit Touch":
        return "Computer Kit Touch"
    elif kit=="Computer Kit Complete":
        return "Computer Kit Complete"
    elif kit=="Computer Kit":
        return "Computer Kit"
    elif kit=="Harry Potter Kano Coding Kit":
        return "Harry Potter Kano Coding Kit"
    elif kit=="Motion Sensor Kit":
        return "Motion Sensor Kit"
    elif kit=="Pixel Kit":
        return "Pixel Kit"
    else:
        raise BaseException("Kit not found in answers data. Check to make sure the first response contains a string with the kit name")

def lambda_handler(event, context):

    print("Received event: " + json.dumps(event))

    operation = event['httpMethod']
    if operation in operations:
        data = json.loads(event['body'])
        print("Received data: " + json.dumps(data))
        ticket_id = None
        zd_error = False

        try:
            # create ticket
            if data["email"] is not None: 
                ticket_id = createTicket(data)
                print("Ticket id is {}".format(ticket_id))
                # end if
        except Exception as err:
            print("error on creation of Zendesk ticket")
            print("Error was of type: {}".format(type(err)))
            print("Error was: {}".format(str(err)))
            ticket_id = None
            zd_error = True

        try:
            db_response = updateDatabase(data, ticket_id)
        except Exception as dberr:
            print("error on save to dynamo")
            print("Error was of type: {}".format(type(dberr)))
            return respond(Exception('Seems the db is not impressed'))

        return respond(None, db_response, zd_error)
    else: 
        return respond(ValueError('Unsupported method "{}"'.format(operation)))