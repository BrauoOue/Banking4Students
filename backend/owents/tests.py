from django.core.files.uploadedfile import SimpleUploadedFile
from rest_framework.test import APITestCase
from rest_framework import status
import os


class ImageUploadTestCase(APITestCase):
    def test_upload_image(self):
        # Open the image file you want to upload
        image_path = os.path.join(os.path.dirname(__file__),
                                  '../testing/IMG_1264.jpg')  # Replace with your image file path
        with open(image_path, 'rb') as image_file:
            # Create a SimpleUploadedFile from the image content
            image = SimpleUploadedFile(
                name="image.png",
                content=image_file.read(),
                content_type="image/png"
            )

        # Send a POST request with the image
        response = self.client.post(
            "/api/owents/analyze-receipt/",  # Change to match your actual API URL
            {"image": image},
            format="multipart"
        )

        # Check if the response is successful
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Print the response (useful for debugging)
        print(response.json())
