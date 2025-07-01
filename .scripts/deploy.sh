#!/bin/bash
# Exit if any command fails
set -e

# Load environment
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
source ~/.bashrc 2>/dev/null || true
source ~/.profile 2>/dev/null || true

# Print environment info for debugging
echo "Node version: $(node -v 2>/dev/null || echo 'Not found')"
echo "NPM version: $(npm -v 2>/dev/null || echo 'Not found')"

# Get arguments
DEPLOY_PATH=$1
GIT_REPO_URL=$2

# Define the shared path
SHARED_PATH="$DEPLOY_PATH/shared"
LOG_FILE="$DEPLOY_PATH/logs/deploy.log"
APP_PATH="$DEPLOY_PATH/prod"
ENV_FILE="$SHARED_PATH/.env.prod"

if [ -z "$DEPLOY_PATH" ] || [ -z "$GIT_REPO_URL" ]; then
  echo "Error: DEPLOY_PATH and GIT_REPO_URL arguments are required!" | tee -a $LOG_FILE
  exit 1
fi

# Check logs directory
if [ ! -d "$DEPLOY_PATH/logs" ]; then
  mkdir -p "$DEPLOY_PATH/logs"
  chmod 775 "$DEPLOY_PATH/logs"
fi

# Check shared directory
if [ ! -d "$SHARED_PATH" ]; then
  mkdir -p "$SHARED_PATH"
  echo "Created shared directory at $SHARED_PATH" | tee -a $LOG_FILE
fi

echo "$(date): Deploying application..." | tee -a $LOG_FILE

EXISTS=1

# SSH Agent Setup with improved error handling
if ! ssh-add -l &>/dev/null; then
  echo "Setting up SSH agent..." | tee -a $LOG_FILE
  eval "$(ssh-agent -s)" >>$LOG_FILE 2>&1 || {
    echo "Error: Failed to setup SSH agent!" | tee -a $LOG_FILE
    exit 1
  }
fi

# SSH Key Management
if ! ssh-add -l | grep -q "github_ssh_key"; then
  echo "Adding SSH key..." | tee -a $LOG_FILE
  ssh-add ~/.ssh/github_ssh_key >>$LOG_FILE 2>&1 || {
    echo "Error: Failed to add SSH key!" | tee -a $LOG_FILE
    exit 1
  }
fi

# Clone project if it doesn't exist
if [ ! -d "$APP_PATH" ]; then
  echo "Cloning code from $GIT_REPO_URL..." | tee -a $LOG_FILE
  git clone --depth 1 $GIT_REPO_URL "$APP_PATH" >>$LOG_FILE 2>&1 || {
    echo "Error: Failed to clone code from $GIT_REPO_URL!" | tee -a $LOG_FILE
    exit 1
  }
  EXISTS=0
fi

# Move to deployment directory
cd "$APP_PATH"

# Git Safe Directory Configuration
if ! git config --get-all safe.directory | grep -q "$APP_PATH"; then
  echo "Adding $APP_PATH to Git's safe.directory list..." | tee -a $LOG_FILE
  git config --global --add safe.directory "$APP_PATH"
fi

# Initial Setup or Update
if [ $EXISTS -eq 0 ]; then
  echo "Setting initial ownership and permissions..." | tee -a $LOG_FILE
  chown -R $USER:$USER "$APP_PATH"
  chmod -R 755 "$APP_PATH"
else
  # Existing repository update
  # Check if Git pull strategy is already configured
  if [ -z "$(git config --get pull.ff)" ]; then
    echo "Configuring Git pull strategy..." | tee -a $LOG_FILE
    git config pull.ff only
  fi

  # Fetch the latest changes from remote
  echo "Fetching latest changes..." | tee -a $LOG_FILE
  git fetch origin >>$LOG_FILE 2>&1 || {
    echo "Error: Failed to fetch from remote!" | tee -a $LOG_FILE
    exit 1
  }

  # Reset to match remote branch exactly, discarding any local changes
  echo "Resetting to match remote branch..." | tee -a $LOG_FILE
  git reset --hard origin/main >>$LOG_FILE 2>&1 || {
    echo "Error: Failed to reset to remote branch!" | tee -a $LOG_FILE
    exit 1
  }
fi

# Dependency Installation
echo "Installing dependencies..." | tee -a $LOG_FILE
npm ci --legacy-peer-deps >>$LOG_FILE 2>&1 || {
  echo "Error: Failed to install dependencies!" | tee -a $LOG_FILE
  exit 1
}

# Environment File Management
echo "Checking environment file..." | tee -a $LOG_FILE
if [ ! -f "$ENV_FILE" ]; then
  echo "Warning: Environment file not found at $ENV_FILE, using default .env if it exists" | tee -a $LOG_FILE
else
  echo "Copying environment file from $ENV_FILE to $APP_PATH/.env" | tee -a $LOG_FILE
  cp -f "$ENV_FILE" "$APP_PATH/.env"
fi

# Build Application
echo "Building application..." | tee -a $LOG_FILE
npm run build >>$LOG_FILE 2>&1 || {
  echo "Error: Failed to build the application!" | tee -a $LOG_FILE
  exit 1
}

echo "Deployment completed successfully!" | tee -a $LOG_FILE
