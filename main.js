const image = document.getElementById('image');
const dropContainer = document.getElementById('container');
const warning = document.getElementById('warning');
const fileInput = document.getElementById('fileUploader');
const resultsBox = document.getElementById('results');

function preventDefaults(e) {
  e.preventDefault();
  e.stopPropagation();
}

['dragenter', 'dragover'].forEach(eventName => {
  dropContainer.addEventListener(eventName, () => dropContainer.classList.add('highlight'), false);
});

['dragleave', 'drop'].forEach(eventName => {
  dropContainer.addEventListener(eventName, () => dropContainer.classList.remove('highlight'), false);
});

['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
  dropContainer.addEventListener(eventName, preventDefaults, false);
});

dropContainer.addEventListener('drop', gotImage, false);
fileInput.addEventListener('change', e => gotImage({ dataTransfer: { files: e.target.files } }));

function clickUploader() {
  fileInput.click();
}

function gotImage(e) {
  const dt = e.dataTransfer;
  const files = dt.files;

  if (files.length > 1) {
    console.error('Upload only one file');
    return;
  }

  const file = files[0];
  const reader = new FileReader();
  reader.readAsDataURL(file);

  reader.onloadend = () => {
    image.src = reader.result;
    image.onload = classifyImage;
  };
}

function classifyImage() {
  resultsBox.innerHTML = "🔍 Classifying...";
  const classifier = ml5.imageClassifier('MobileNet', () => {
    classifier.classify(image, 5, (err, results) => {
      if (err) {
        console.error(err);
        resultsBox.innerHTML = "❌ Error during classification.";
        return;
      }

      resultsBox.innerHTML = "<h3>Top Predictions:</h3>";
      results.forEach((res, index) => {
        const line = `${index + 1}. ${res.label} - ${(res.confidence * 100).toFixed(2)}%`;
        const p = document.createElement('p');
        p.textContent = line;
        resultsBox.appendChild(p);
      });
    });
  });
}
