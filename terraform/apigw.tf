resource "aws_api_gateway_rest_api" "troubleshooter" {
  name        = "kes-troubleshooter"
  description = "Terraform Serverless Application For the CC Troubleshooter Tool "
}

resource "aws_api_gateway_resource" "proxy" {
  rest_api_id = "${aws_api_gateway_rest_api.troubleshooter.id}"
  parent_id   = "${aws_api_gateway_rest_api.troubleshooter.root_resource_id}"
  path_part   = "{proxy+}"
}

resource "aws_api_gateway_method" "proxy" {
  rest_api_id   = "${aws_api_gateway_rest_api.troubleshooter.id}"
  resource_id   = "${aws_api_gateway_resource.proxy.id}"
  http_method   = "ANY"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "lambda" {
  rest_api_id = "${aws_api_gateway_rest_api.troubleshooter.id}"
  resource_id = "${aws_api_gateway_method.proxy.resource_id}"
  http_method = "${aws_api_gateway_method.proxy.http_method}"

  integration_http_method = "POST"
  type                    = "AWS_PROXY"
  uri                     = "${aws_lambda_function.troubleshooter.invoke_arn}"
}

resource "aws_api_gateway_deployment" "troubleshooter" {
  depends_on = [
    "aws_api_gateway_integration.lambda"
  ]

  rest_api_id = "${aws_api_gateway_rest_api.troubleshooter.id}"
  stage_name  = "dev"
}

resource "aws_lambda_permission" "apigw" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = "${aws_lambda_function.troubleshooter.arn}"
  principal     = "apigateway.amazonaws.com"

  # The /*/* portion grants access from any method on any resource
  # within the API Gateway "REST API".
  source_arn = "${aws_api_gateway_deployment.troubleshooter.execution_arn}/*/*"
}