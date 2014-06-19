jsSteg 1.0
=========

jsSteg is a Javascript library designed for JPEG Steganography. It provides easy access to the discrete cosine transform (DCT) coefficients in JPEGs, both for reading hidden messages, and for embedding them.

It builds on open source Javascript JPEG encoders and decoders, although they were heavily modified to provide hooks for reading and modifying DCT coefficients. The main library, and JPEG encoder are released under the MIT licence, but the decoder is licenced under the Apache License, Version 2.0.

At the current time it is not suitable for chroma steganography since the encoder and decoder return a different quantity of coefficients for chroma for reasons I haven't investigated. That said, nobody does chroma steganography so if you're after luma then this is perfect for you.
