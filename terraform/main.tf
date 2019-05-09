terraform {
    required_version = ">= 0.11.7"
    backend "s3" {
        bucket = "terraform.kano"
        key = "KES/troubleshooter.tfstate"
        region = "eu-west-1"
    }
}

provider "aws" {
    version = "~> 1.41"
    region = "${var.aws_region}"
}

module "troubleshooter" {
    source = "../modules/spa"
    name = "troubleshooter"
    project_tag = "kes-troubleshooter"
}
