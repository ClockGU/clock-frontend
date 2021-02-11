# Rename current origin and add real remote for Sentry
git remote rename origin dokku
git remote add origin $REPOSITORY_URL

# Cleanup any pre-existing `sentry-cli` folders
rm -rf sentry-cli

# Install sentry-cli
export INSTALL_DIR=$(pwd)
export INSTALL_PATH="${INSTALL_DIR}/sentry-cli"
export SENTRY_CLI="${INSTALL_PATH}"
curl -sL https://sentry.io/get-cli | bash

# Let `sentry-cli` define a release version
$SENTRY_CLI --version
VERSION=`${SENTRY_CLI} releases propose-version`

# Create a release
$SENTRY_CLI releases new -p ${SENTRY_PROJECT} $VERSION

# Associate commits with the release
$SENTRY_CLI releases set-commits --auto $VERSION
$SENTRY_CLI releases finalize $VERSION

# Tell sentry about deploy
$SENTRY_CLI releases deploys $VERSION new -e ${VUE_APP_ENV}

# Restore previous origin name
git remote remove origin
git remote rename dokku origin
