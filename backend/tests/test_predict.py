from pathlib import Path


def test_predict(client, sample_image_path):
    response = client.post(
        "/upload", files={"upload_file": Path(sample_image_path).open("rb")}
    )
    assert response.status_code == 200
