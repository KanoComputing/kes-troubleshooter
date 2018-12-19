# -*- coding: utf-8 -*-
# pylint: disable=E0401

import json, sys, ast, os
sys.path.insert(0, "python-packages")

from zenpy import Zenpy
from zenpy.lib.api_objects import Ticket
from zenpy.lib.api_objects import User
from zenpy.lib.api_objects import Comment

def updateDatabase(data, zendesk_ticket_id=None):
    
    row = {
        'session_id': data["session_id"],
        'answers': data["answers"],
        'resolved': data["resolved"],
        'jira_key': data["jira_key"],
        'zendesk_ticket_id': zendesk_ticket_id
    }

    # @todo implement code to write to database here
    # it should overwrite any existing data for the given session ID

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
    kit = getKitFromAnswers(data["answers"])
    
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
        note += "<li>%s: %s</li>" % (answer["question"], answer["answer"])
    note += "</ul>"

    # Create Ticket in Zendesk
    ticket = Ticket(
        requester = User(email=data["email"]),
        subject = "Troubleshooter: " + terminal["diagnosis"],
        tags = ["troubleshooter"],
        comment = Comment(html_body=note, public=False)
    )

    audit = zenpy_client.tickets.create(ticket)
    
    # @TODO
    # Link with Jira Issue 
    # something like this: zenpy_client.jira_links.create()
    
    # @TODO
    # Specify the product

    return audit.ticket.id


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

def handler(data):
    
    # write to the database
    updateDatabase(data)

    # create ticket
    if data["email"] is not None: 
        ticket_id = createTicket(data)
        updateDatabase(data, ticket_id)