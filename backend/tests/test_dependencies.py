def test_input_shape():
    from app.dependencies import get_input_shape

    assert get_input_shape("InceptionResNetV2-imagenet") == (-1, 299, 299, 3)
