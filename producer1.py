# import libraries
import time
import logging
from python_logging_rabbitmq import RabbitMQHandler

# set app name
APP_NAME = "app1"

# configure logging
FORMAT = "[%(asctime)s.%(msecs)03d] %(levelname)s [%(thread)d] [%(name)s] %(message)s"
formatter = logging.Formatter(fmt=FORMAT)
rabbit = RabbitMQHandler(formatter=formatter)

logger = logging.getLogger(APP_NAME)
logger.setLevel(logging.DEBUG)

# configure RabbitMQ logger
rabbit = RabbitMQHandler(
    host="localhost",
    port=5672,
    exchange="amq.topic",
    fields={"source": f"{APP_NAME}-producer", "env": "development"},
    fields_under_root=True,
)
logger.addHandler(rabbit)

# simulate logging messages
for i in range(1000):
    logger.debug(f"... this is a log message from '{APP_NAME}'.")
    time.sleep(1)

    logger.info(f"--- this is a log message from '{APP_NAME}'.")
    time.sleep(1)

    logger.warning(f"*-* this is a log message from '{APP_NAME}'.")
    time.sleep(1)

    logger.error(f"*** this is a log message from '{APP_NAME}'.")
    time.sleep(1)
