const { S3Client, GetObjectCommand, ListObjectsV2Command, PutObjectCommand, HeadObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { AWS_URL, AWS_PUBLIC_BUCKET, AWS_SECURE_BUCKET, AWS_ACCESS_KEY, AWS_SECRET_KEY,AWS_SECURE_URL } = process.env;
const S3 = new S3Client({
  region: 'auto',
  endpoint: AWS_URL,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY,
    secretAccessKey: AWS_SECRET_KEY,
  },
});

async function loadAWSFile(req, res, next) {
  console.log(AWS_URL)
  const params = {
    Bucket: AWS_SECURE_BUCKET,
    Key: `avatar/te.png`
  };

  try {
    const response = await getSignedUrl(S3, new GetObjectCommand(params), { expiresIn: 600 });
    console.log(response)
    res.send(response);
  } catch (err) {
    res.status(500).send('Error to connect to Amazon S3');
  }
}

// upload on public bucket
async function uploadPublicAWSFile(req, res, next) {
  const uploadParams = {
    Bucket: AWS_PUBLIC_BUCKET,
    Key: req.key,
    Body: req.file.buffer,
    ContentType: req.file.mimetype
  };
  try {
    const uploadCommand = new PutObjectCommand(uploadParams);
    const response = await S3.send(uploadCommand);
    if(!response) return res.status(400).json({ errors:[{"type": "data", message: "Invalid file!"}] });
    next();
  } catch (err) {
    res.status(400).json({ errors:[{"type": "data", message: "File server connected fail!"}] });
  }
}

// upload on secure bucket
async function createPresignedUrlUpload(req, res, next) {
  try {
    const uploadParams = {
      Bucket: AWS_SECURE_BUCKET,
      Key: `task/${req.params.id}/${req.file}/${req.body.name}`,
    };
    const response = await getSignedUrl(S3, new PutObjectCommand(uploadParams), { expiresIn: 600 })
    if(!response) return res.status(400).json({ errors:[{"type": "data", message: "Invalid file!"}] });
    req.result=response;
    next();
  } catch (err) {
    res.status(400).json({ errors:[{"type": "data", message: "File server connected fail!"}] });
  }
}
// upload on secure bucket
async function createPresignedUrlDownload(req, res, next) {
  try {
    const uploadParams = {
      Bucket: AWS_SECURE_BUCKET,
      Key: `task/${req.params.id}/${req.body._id}/${req.body.name}`,
    };
    const response = await getSignedUrl(S3, new GetObjectCommand(uploadParams), { expiresIn: 600 })
    if(!response) return res.status(400).json({ errors:[{"type": "data", message: "Invalid file!"}] });
    //new domain replace, improve feature, browser lock S3 defalut domain
    const urlObject = new URL(response);
    const newHostname = new URL(AWS_SECURE_URL).hostname;
    const newUrl = response.replace(urlObject.hostname, newHostname);
    req.result=newUrl;
    next();
  } catch (err) {
    res.status(400).json({ errors:[{"type": "data", message: "File server connected fail!"}] });
  }
}
// check File on s3
async function checkAWSFile(req, res, next) {
  try {
    headers = {
      "x-amz-content-sha256":"UNSIGNED-PAYLOAD"
    }
    const checkParams = {
      Bucket: AWS_SECURE_BUCKET,
      Key: `task/${req.params.id}/${req.body._id}/${req.body.name}`,
    };
    const response = await S3.send( new HeadObjectCommand(checkParams))
    if(!response) return res.status(400).json({ errors:[{"type": "data", message: "Invalid file!"}] });
    req.result=response;
    next();
  } catch (err) {
    res.status(400).json({ errors:[{"type": "data", message: "File server connected fail!"}] });
  }
}
// delete a File on s3
async function deleteAWSFile(req, res, next) {
  try {
    headers = {
      "x-amz-content-sha256":"UNSIGNED-PAYLOAD"
    }
    const checkParams = {
      Bucket: AWS_SECURE_BUCKET,
      Key: `task/${req.params.id}/${req.body._id}/${req.body.name}`,
    };
    const response = await S3.send( new DeleteObjectCommand(checkParams))
    if(!response) return res.status(400).json({ errors:[{"type": "data", message: "Invalid file!"}] });
    req.result=response;
    next();
  } catch (err) {
    res.status(400).json({ errors:[{"type": "data", message: "File server connected fail!"}] });
  }
}

module.exports = { loadAWSFile, uploadPublicAWSFile , createPresignedUrlUpload, createPresignedUrlDownload, checkAWSFile, deleteAWSFile};