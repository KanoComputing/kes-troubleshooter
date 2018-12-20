import sys
sys.path.insert(0, "python_packages")

from tsserver import lambda_handler

event = {
  "body": "{\"session_id\":\"falseistrue\",\"email\":\"russell@kano.me\",\"answers\":[{\"question\":\"Which Kano kit are you having trouble with?\",\"type\":\"question\",\"options\":{\"Computer Kit Touch\":1,\"Harry Potter Kano Coding Kit\":31,\"Motion Sensor Kit\":56},\"answer\":\"Harry Potter Kano Coding Kit\"},{\"question\":\" Have you been able to open the Kano App successfully?\",\"type\":\"question\",\"options\":{\"Yes\":32,\"No\":49},\"answer\":\"Yes\"},{\"question\":\" Have you been able to connect your Wand to the App?\",\"type\":\"question\",\"options\":{\"Yes\":33,\"No\":38},\"answer\":\"Yes\"},{\"question\":\" When you open up a challenge on the Play tab, do you see a colorful world on the right side of your screen?\",\"type\":\"question\",\"options\":{\"Yes\":34,\"No\":37},\"answer\":\"Yes\"},{\"question\":\" Great! If you set the wand on a table, does the wand drift off the screen?\",\"type\":\"question\",\"options\":{\"Yes\":35,\"No\":36},\"answer\":\"Yes\"},{\"question\":\" Sorry to hear that. Let's get you a new wand.\",\"type\":\"known_issue\",\"diagnosis\":\" Wand drifting\",\"customer_solution\":\" Put your wand on a table and leave it on the playground. It should stop drifting. If it doesn’t let us know!\",\"agent_solution\":\" Ask them to compare with baseline drift video. Replace if it does indeed drift more than it should.\"}],\"resolved\":null}",
  "resource": "/{proxy+}",
  "path": "/answers",
  "httpMethod": "POST",
  "isBase64Encoded": "true",
  "headers": {
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
    "Accept-Encoding": "gzip, deflate, sdch",
    "Accept-Language": "en-US,en;q=0.8",
    "Cache-Control": "max-age=0",
    "CloudFront-Forwarded-Proto": "https",
    "CloudFront-Is-Desktop-Viewer": "true",
    "CloudFront-Is-Mobile-Viewer": "false",
    "CloudFront-Is-SmartTV-Viewer": "false",
    "CloudFront-Is-Tablet-Viewer": "false",
    "CloudFront-Viewer-Country": "US",
    "Host": "1234567890.execute-api.us-west-1.amazonaws.com",
    "Upgrade-Insecure-Requests": "1",
    "User-Agent": "Custom User Agent String",
    "Via": "1.1 08f323deadbeefa7af34d5feb414ce27.cloudfront.net (CloudFront)",
    "X-Amz-Cf-Id": "cDehVQoZnx43VYQb9j2-nvCh-9z396Uhbp027Y2JvkCPNLmGJHqlaA==",
    "X-Forwarded-For": "127.0.0.1, 127.0.0.2",
    "X-Forwarded-Port": "443",
    "X-Forwarded-Proto": "https"
  },
  "requestContext": {
    "accountId": "123456789012",
    "resourceId": "123456",
    "stage": "prod",
    "requestId": "c6af9ac6-7b61-11e6-9a41-93e8deadbeef",
    "requestTime": "09/Apr/2015:12:34:56 +0000",
    "requestTimeEpoch": 1428582896000,
    "identity": {
      "cognitoIdentityPoolId": "null",
      "accountId": "null",
      "cognitoIdentityId": "null",
      "caller": "null",
      "accessKey": "null",
      "sourceIp": "127.0.0.1",
      "cognitoAuthenticationType": "null",
      "cognitoAuthenticationProvider": "null",
      "userArn": "null",
      "userAgent": "Custom User Agent String",
      "user": "null"
    },
    "path": "/answer",
    "resourcePath": "/{proxy+}",
    "httpMethod": "POST",
    "apiId": "1234567890",
    "protocol": "HTTP/1.1"
  }
}

resp = lambda_handler(event, {})
print("response was {}".format(resp))