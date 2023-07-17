const imagePickerElement = document.querySelector('#image-upload-control input');
const imagePreviewElement = document.querySelector('#image-upload-control img');

function updateImagePreview() {
  const files = imagePickerElement.files;

  if (!files || files.length === 0) {
    imagePreviewElement.style.display = 'none';
    return;
  }

  const pickedFile = files[0];

  /**Url is a built in class that has createObjectURL method that creates a local url for us cuz the image is present in the client side
   thus we need to  create  a localurl.
   */
  imagePreviewElement.src = URL.createObjectURL(pickedFile);
  imagePreviewElement.style.display = 'block';
}

imagePickerElement.addEventListener('change', updateImagePreview);