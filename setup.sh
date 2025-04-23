SOLS_TO_AIRDROP=1000

install_solana_cli() {
    if ! command -v solana &> /dev/null; then
        echo "Solana CLI not found. Installing..."
        sh -c "$(curl -sSfL https://release.solana.com/v1.18.18/install)"
    else
        echo "Solana CLI already installed."
    fi
}

install_deps() {
    echo "Installing dependencies..."
    read -p "Do you want to install Solana CLI? (y/n): " install_solana
    if [ "$install_solana" == "y" ]; then
        install_solana_cli
    fi

    read -p "Do you use yarn or npm for package management? (1 for Yarn, 2 for NPM, type anything else to skip dependency installation): " package_manager
    if [ "$package_manager" == "1" ]; then
        if ! command -v yarn &> /dev/null; then
            echo "Yarn not found. Installing..."
            npm install -g yarn@1.22.22
            rm ./package-lock.json
        else
            echo "Yarn already installed."
        fi
        yarn install
        yarn global add ts-node
    elif [ "$package_manager" == "2" ]; then
        npm install --legacy-peer-deps
        npm install -g ts-node
        rm ./yarn.lock
    else
        echo "Skipping dependency installation."
    fi
}
generate_keypair() {
    local key_file=$1
    if [ -f "$key_file" ]; then
        read -p "$key_file already exists. Do you want to overwrite it? (y/n): " overwrite
        if [ "$overwrite" != "y" ]; then
            echo "Skipping $key_file keypair generation."
            return
        fi
    fi
    echo "Generating $key_file keypair..."
    solana-keygen new --outfile "$key_file" --no-bip39-passphrase --force
}

airdrop() {
    local keypair=$1
    local amount=$2
    echo "Airdropping $amount SOL to $keypair..."
    solana airdrop $amount --url https://rpc.test.honeycombprotocol.com -k $keypair
    echo "$amount SOL airdropped to $keypair."
}

install_deps

if [ ! -d "./lib/keys" ]; then
    echo "Creating the keys directory..."
    mkdir lib/keys
else
    echo "keys directory already exists."
fi


echo "Generating admin keypair..."
generate_keypair "./lib/keys/admin.json"

airdrop "./lib/keys/admin.json" $SOLS_TO_AIRDROP

echo "Setup completed. Happy mining!" 

