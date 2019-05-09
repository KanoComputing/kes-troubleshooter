resource "aws_dynamodb_table" "troubleshooter" {
    name           = "KESTroubleShooter"
    billing_mode   = "PROVISIONED"
    read_capacity  = 5
    write_capacity = 5
    hash_key       = "SessionID"

    attribute {
        name = "SessionID"
        type = "S"
    }

    tags = {
        Name = "kes-troubleshooter"
        Team = "Services"
        Project = "kes-troubleshooter"
    }
}