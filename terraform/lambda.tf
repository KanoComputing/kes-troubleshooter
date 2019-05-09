resource "aws_lambda_function" "troubleshooter" {
    function_name = "kes-troubleshooter"

    s3_bucket = "kes-lambda"
    s3_key    = "v1/troubleshooter.zip"

    handler = "tsserver.lambda_handler"
    runtime = "python3.6"

    environment {
        variables = {
            ZENDESK_EMAIL = "${var.zendd_email}",
            ZENDESK_API_TOKEN = "${var.zendd_token}"
        }
    }

    role = "${aws_iam_role.lambda_exec.arn}"

    tags = {
        Name = "kes-troubleshooter"
        Team = "Services"
        Project = "kes-troubleshooter"
    }
}

# IAM role which dictates what other AWS services the Lambda function
# may access.
resource "aws_iam_role" "lambda_exec" {
  name = "kes_troubleshooter_lambda"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
EOF
}

# resource "aws_cloudwatch_log_group" "troubleshooter" {
#   name              = "/aws/lambda/${aws_lambda_function.troubleshooter.function_name}"
#   retention_in_days = 14
# }

resource "aws_iam_policy" "lambda_logging" {
  name = "lambda_logging"
  path = "/"
  description = "IAM policy for logging from a lambda"

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents"
      ],
      "Resource": "arn:aws:logs:*:*:*",
      "Effect": "Allow"
    }
  ]
}
EOF
}

resource "aws_iam_role_policy" "dynamo_lambda" {
    name = "dynamo-lambda-policy"
    role = "${aws_iam_role.lambda_exec.id}"
    policy = <<EOF
{
    "Version": "2008-10-17",
    "Statement": [
        {
            "Action": "dynamodb:*",
            "Effect": "Allow",
            "Resource": "${aws_dynamodb_table.troubleshooter.arn}",
            "Sid": ""
        }
    ]
}
EOF
}
resource "aws_iam_role_policy_attachment" "lambda_logs" {
  role = "${aws_iam_role.lambda_exec.name}"
  policy_arn = "${aws_iam_policy.lambda_logging.arn}"
}