# import libraries
import os
import sys
import time
import pika


def main():
    # set up connection to RabbitMQ
    connection = pika.BlockingConnection(pika.ConnectionParameters(host="localhost"))
    channel = connection.channel()

    # link to our app1-error queue
    channel.queue_declare(queue="app1-error", durable=True)

    # create a function to process the messages in the queue
    def callback(ch, method, properties, body):
        # just printing in console here, but can be linked to file or database
        print(f" [x] Received:\n{body}")
        # just adding a delay for demonstration purposes
        time.sleep(2)

    # link the callback function to the queue
    channel.basic_consume(queue="app1-error", on_message_callback=callback, auto_ack=True)

    print(" [*] Waiting for messages. To exit press CTRL+C.")
    channel.start_consuming()


if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("Interrupted")
        try:
            sys.exit(0)
        except SystemExit:
            os._exit(0)
