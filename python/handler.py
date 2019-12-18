import boto3
import logging

logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)


def delete_activity(event, context):
    logger.info(event)


def textExactEnd(event, context):
    logger.info(event)
