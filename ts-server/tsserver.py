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

operations = ['POST']
checkParamsList = ['session_id', 'email', 'answers', 'resolved']

def checkBodyParams(event):
    if 'body' not in event or not event['body']:
        raise Exception("Bad Request: Request must contain a body")
    bodyParams = json.dumps(event['body'])
    if not all(param in bodyParams for param in checkParamsList):
        raise Exception("Bad Request: Body should contain: {}".format(checkParamsList))

def sanatiseAnswers(answerSet):
    cleanAnswerSet = []
    for answer in answerSet:
        cleanAnswerSet.append(dict((k, v) for k, v in answer.items() if v))
    return cleanAnswerSet

def respond(err=None, res=None, zd_error=False):
    bodyJson = {"zd_error": zd_error}
    return {
        'statusCode': '400' if err else '200',
        'body': json.dumps({ 'message': str(err) } if err else bodyJson),
        'headers': {
            'Content-Type': 'application/json',
            "Access-Control-Allow-Origin": "*",
        },
        "isBase64Encoded": False,
    }

def updateDatabase(data, zendesk_ticket_id=None):
    item = {
        'SessionID': data["session_id"],
        'Answers': sanatiseAnswers(data["answers"]),
        'Resolved': True if data["resolved"] else False,
        'Updated' : str(datetime.now()),
    }
    # Add conditional items
    if "jira_key" in data and data["jira_key"] is not None:
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
    
    # Associate with the right product in ZenDesk
    kit = getKitFromAnswers(data["answers"])
    
    # Create a Private Note Describing the Issue
    note = "This customer had an unresolved issue. They need your help!"
    note += "<h3>Summary</h3>"
    note += "<ul>"
    note += "<li><b>Kit</b>: %s</li>" % (kit["name"])
    note += "<li><b>Diagnosis</b>: %s (Jira Issue %s)</li>" % (terminal["diagnosis"],"None Linked" if "jira_key" not in terminal else "<a href='https://kanocomputing.atlassian.net/browse/{}'>{}</a>".format(terminal["jira_key"],terminal["jira_key"]))
    if "agent_solution" in terminal:
        note += "<li><b>Agent Solution</b>: %s</li>" % (terminal["agent_solution"])
    if "customer_solution" in terminal:
        note += "<li><b>Solution Attempted By Customer</b>: %s</li>" % (terminal["customer_solution"])
    note += "</ul>"
    note += "<h3>Customer's Answers</h3>"
    note += "<ul>"
    for answer in data["answers"]:
        if "question" in answer and "answer" in answer:
            note += "<li>%s: %s</li>" % (answer["question"], answer["answer"])
    note += "</ul>"

    # Create Ticket in Zendesk
    username = data["email"].split("@")[0]
    ticket = Ticket(
        requester = User(email=data["email"],name=username),
        subject = "Troubleshooter: " + terminal["diagnosis"],
        tags = ["troubleshooter"],
        comment = Comment(html_body=note, public=False),
        custom_fields = { "id": 360000204079, "value": kit["field"]} # product
    )

    audit = zenpy_client.tickets.create(ticket)
    
    # @TODO
    # Link with Jira Issue 
    # something like this: zenpy_client.jira_links.create()

    return audit.ticket.id

def getKitFromAnswers(answers):
    kit = answers[0]["answer"]
    if kit=="Computer Kit Touch":
        return {
            "name": "Computer Kit Touch",
            "field": "kano_computer_kit_touch"
        }
    elif kit=="Computer Kit Complete":
        return {
            "name": "Computer Kit Complete",
            "field": "kano_computer_kit_complete"
        }
    elif kit=="Computer Kit":
        return {
            "name": "Computer Kit",
            "field": "kano_computer_kit"
        }
    elif kit=="Harry Potter Kano Coding Kit":
        return {
            "name": "Harry Potter Kano Coding Kit",
            "field": "kano_harry_potter_coding_kit"
        }
    elif kit=="Motion Sensor Kit":
        return {
            "name": "Motion Sensor Kit",
            "field": "kano_motion_sensor"
        }
    elif kit=="Pixel Kit":
        return {
            "name": "Pixel Kit",
            "field": "kano_pixel_kit"
        }
    else:
        raise BaseException("Kit not found in answers data. Check to make sure the first response contains a string with the kit name")
        
def lambda_handler(event, context):

    print("Received event: " + json.dumps(event))

    operation = event['httpMethod']
    if operation in operations:
        try: 
            checkBodyParams(event)
        except Exception as perr:
            return respond(perr)

        data = json.loads(event['body'])
        print("Received data: " + json.dumps(data))
        ticket_id = None
        zd_error = False

        try:
            # create ticket
            if data["email"]:
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