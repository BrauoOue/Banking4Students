from openai import OpenAI
import json
import base64
import io
from PIL import Image

import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
receipt_spliter = os.path.join(BASE_DIR, "ai_modules", "instructions", "ReceiptSplitter")


class LLMAssistant:
    ReceiptSplitter_INSTRUCTIONS_DIR = receipt_spliter

    def __init__(self, api_key: str, starting_instructions: str, model=None):
        self.starting_instructions = self.to_developer_message(starting_instructions)
        self.history = []
        self.model = model if model else "gpt-4o-mini"
        self.client = OpenAI(api_key=api_key)

    @staticmethod
    def to_developer_message(instruction: str) -> dict:
        """
            Creates a structured message representing a developer's input.

            Parameters:
                instruction (str): The instruction or message from the developer.

            Returns:
                dict: A dictionary with the role set to "developer" and the content as the provided instruction.
        """
        return {"role": "developer", "content": instruction}

    @staticmethod
    def to_user_message(message: str) -> dict:
        """
            Creates a structured message representing a user's input.

            Parameters:
                message (str): The message from the user.

            Returns:
                dict: A dictionary with the role set to "user" and the content as the provided message.
        """
        return {"role": "user", "content": message}

    @staticmethod
    def to_assistant_message(response: str) -> dict:
        """
            Creates a structured message representing the assistant's response.

            Parameters:
                response (str): The response from the assistant.

            Returns:
                dict: A dictionary with the role set to "assistant" and the content as the provided response.
        """
        return {"role": "assistant", "content": response}

    def to_image_message(self, prompt, image_base64):

        return {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": prompt,
                },
                {
                    "type": "image_url",
                    "image_url": {"url": f"data:image/jpeg;base64,{image_base64}"},
                },
            ],
        }

        # return {"type": "image_url", "image_url": f"data:image/png;base64,{image_base64}"}

    @staticmethod
    def print_context(context: list):
        """
            Prints the content of all messages in a given conversation context.

            Parameters:
                context (list): A list of messages to be printed.

            Behavior:
                - Iterates through the context and prints each message's content.
        """
        for message in context:
            print(message["content"])

    def __ask_assistant(self, context: list, max_tokens=None) -> str:
        """
            Sends the conversation context to the assistant model and retrieves a response.

            Parameters:
                context (list): A list of messages forming the conversation history.
                max_tokens (int, optional): The maximum number of tokens the response can contain.

            Returns:
                str: The assistant's response to the provided context.

            Behavior:
                - Uses the assistant client to generate a response based on the given context.
                - Stores the response for future interactions.
        """
        response = self.client.chat.completions.create(
            model=self.model,
            messages=context,
            max_tokens=max_tokens,
            n=1,
            store=True
        )

        return response.choices[0].message.content

    def consult_once(self, prompt: dict | str, structured_input: bool = False, structured_output=None):
        """
           Performs a single consultation with the assistant using script content and instructions.

           Parameters:
               prompt (str): The input to prompt the assistant.
               structured_input (bool): Is the prompt in a structured format, like JSON

           Returns:
               str: The assistant's response.

           Behavior:
               - Constructs a user message combining the prompt
               - Calls the assistant with the generated context.
       """

        if structured_input:
            prompt = json.dumps(prompt, indent=4)

        message = self.to_user_message(prompt)
        context = [self.starting_instructions, message]
        output = self.__ask_assistant(context)

        if structured_output == "json":
            output.replace("\n", "")
            output = json.loads(output)

        return output

    def end_conversation(self):
        """
            Closes the assistant's client connection, ending the conversation.

            Behavior:
                - Calls the 'close' method of the assistant client.
        """
        self.client.close()

    def __draw(self, context):
        response = self.client.images.generate(
            model="dall-e-3",
            prompt=context,
            size="1024x1024",
            n=1)

        return response.data[0].url

    def draw(self, prompt: str):
        context = (f"{prompt}"
                   "\nUse the following style:"
                   f"\n{self.starting_instructions}")
        output = self.__draw(context)
        return output

    def __analyze(self, context):
        response = self.client.chat.completions.create(
            model="gpt-4o-mini",
            messages=context
        )

        a = 1

        return response.choices[0].message.content

    def analyze(self, prompt: str, image: Image, structured_output=None):

        buffered = io.BytesIO()
        image.save(buffered, format="PNG")
        image_base64 = base64.b64encode(buffered.getvalue()).decode('utf-8')
        context = [self.starting_instructions, self.to_image_message(prompt, image_base64)]
        output = self.__analyze(context)

        if structured_output == "json":
            output.replace("\n", "")
            output = json.loads(output)

        a = 1

        return output
