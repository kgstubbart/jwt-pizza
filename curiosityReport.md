# Curiosity Report: GitHub Secrets

## Introduction
I chose GitHub secrets for this write-up because, normally, I have used local secrets to run code; however, this is not possible when running the JWT Pizza CI Pipleines though Github. I was curious on how GitHub handled secrets, and the following are my discoveries.

## What are GitHub Secrets?
GitHub secrets are a secure feature that GitHub provides to store sensitive data, such as API keys or passwords. These secrets are then able to be used in tangent with GitHub actions while remaining private.

Key points:
- **Stored Securly**: The secret can never be found in plaintext.
- **Access Control**: A secret can be assigned a scope of a repo or to an organization (multiple repos).
- **Encryption**: User machine encrypts before ever sent to GitHub.
<img width="3200" height="1800" alt="image" src="https://github.com/user-attachments/assets/c3b0775b-e453-4355-8e20-96155c969497" />


## How It Works
1. **Create Secret**: User creates a secret by inputing the secret name and value.
2. **Encryption**: The value is encrypted before even reaching GitHub servers.
3. **GitHub Storage**: GitHub holds the encrypted value in their database.
4. **Usage**: To use the value, the user writes "${{ secrets.SECRET-NAME }}" into the code.
5. **Call**: When the program is run, it calls the secret from the GitHub server and decrypts it to the correct value.
<img width="653" height="364" alt="image" src="https://github.com/user-attachments/assets/c43d9b90-f871-42b5-bf81-db1b727de834" />

## Cool Facts
- Users browser encrypts the value using public-key encryption through libsodium.
- Admins can see how secrets are being used in organizations.
- If user attempts to print the secret to the log or console, GitHub will replace it with ***.
<img width="1349" height="572" alt="image" src="https://github.com/user-attachments/assets/c56490b2-a7b3-49c3-af0a-fcc2028aeb86" />

## Challenges
- **Short Secrets**: Short secrets may not be encrypted so normal output is not accidentally hidden.
- **No "if" Conditions**: A secret can not be used in an if statement, it must be passed to an environment variable that then can be used in the statement.
- **Human Error**: A user can still leak the secret by using flawed secrurity practices.

## Connection to Our Course
We use GitHub secrets rather than a local .env file in this corse because we base our build and deployment of the program on GitHub Actions. When handling private information, it is important to understand how the securty practices we are using work so we can remove the element of human error.

## Conclusion
GitHub Secrets are an effective way to store sensitive information in a very accessable way. GitHub handles the data securely, and has practices in place to keep it so. Users can, with knowledge and application of how to keep data secure, can use GitHub secrets to their advantage when working with GitHub Actions.
