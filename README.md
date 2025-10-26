**Project Name :** VeriLeaf - On-chain Proof of Planet Impact

**Who are we :**
Debojyoti Banerjee
Krishnendu Samanta

**Project Details :**

VeriLeaf is an AI + blockchain-powered system that verifies real environmental impact using satellite data and records it on the **Celo blockchain**. Users can select any region on a map, and VeriLeaf’s AI analyzes real-time satellite imagery from Planet or Sentinel to measure vegetation health, reforestation progress, and land recovery. The verified results are minted as a **“Proof of Impact” NFT**, stored securely on IPFS and Celo. Each NFT represents transparent, data-backed proof of ecological change. If the project shows positive impact, the user receives a **cUSD reward** instantly via smart contract. Built on Celo’s carbon-negative, mobile-first network, VeriLeaf makes sustainability measurable, transparent, and rewarding — empowering communities, funders, and organizations to prove and incentivize real-world climate action.


**Vision Statement:**
VeriLeaf envisions a world where environmental impact is transparent, verifiable, and rewarding. By combining AI and blockchain, we aim to bridge the trust gap between climate funders, NGOs, and local communities. Our mission is to make every tree planted, every restored forest, and every regenerated ecosystem visible and verifiable from space — creating a global proof layer for sustainability. Through Celo’s green blockchain and stablecoin ecosystem, VeriLeaf empowers people to earn from real climate action, turning transparency into trust and environmental responsibility into a shared, rewarding movement for a greener planet.

**Software Development Plan — VeriLeaf (Built on Celo)**

**Step 1: Smart Contract Design (Solidity on Celo)**

* **Contract Name:** `VeriLeafImpactNFT`
* **Key Variables:**

  * `mapping(uint => ImpactData)` → stores NDVI, vegetation gain, confidence, IPFS CID
  * `address public treasuryWallet` → reward source wallet
  * `uint public rewardThreshold` → minimum impact score for rewards
  * `uint public rewardAmount` → cUSD payout per verified NFT
* **Core Functions:**

  * `mintImpactNFT(address user, string memory metadataURI, uint impactScore)`
  * `distributeReward(address user, uint impactScore)` → transfers cUSD if score ≥ threshold
  * `updateThreshold(uint newThreshold)` (admin)
  * `updateRewardAmount(uint newAmount)` (admin)

**Step 2: Smart Contract Integration (Backend / SDK)**

* Use **Celo ContractKit** to interact with the blockchain.
* Backend triggers mint + reward after AI model verification.

**Step 3: AI + Data Processing Backend (FastAPI + Python)**

* Fetch satellite data → compute NDVI, vegetation gain, confidence.
* Store analysis results and image preview on **IPFS** (via web3.storage).
* Return `impactScore` and IPFS CID to frontend.

**Step 4: Frontend (Next.js + MapLibre + Celo SDK)**

* Map interface: user draws polygon, selects time range.
* Show AI analysis results (NDVI change, vegetation %).
* Button: “Mint Impact Proof” → calls smart contract.
* Dashboard: view owned NFTs, impact stats, rewards.

**Step 5: Deployment & Testing**

* Deploy contracts on **Celo Alfajores testnet**.
* Integrate backend & frontend with wallet connection (e.g., MetaMask, CeloExtensionWallet).
* Final testing: minting flow, cUSD reward, NFT metadata verification on IPFS.

Our journey with **VeriLeaf** began from a simple question — how can we *prove* real environmental change, not just promise it? As a team passionate about both technology and sustainability, we saw how AI could measure nature’s progress from space, and how blockchain could record it transparently for the world to trust. Built during a hackathon on **Celo**, VeriLeaf became our mission to make climate impact visible, verifiable, and rewarding. It’s more than a project — it’s our step toward a future where doing good for the planet is both accountable and incentivized.


🌿 VeriLeaf — On-chain Proof of Planet Impact

Built on the Celo Blockchain | AI × ReFi × Transparency

VeriLeaf verifies real environmental impact using satellite data and records it as a Proof of Impact NFT on Celo.
Users select a region on a map, our AI analyzes vegetation change (NDVI / growth / confidence), and if the impact is positive, they earn a cUSD reward — instantly, transparently, sustainably.

🚀 Tech Stack
Layer	Tools / Frameworks
Frontend	Next.js, React, MapLibre, Celo Wallet Connect
Backend	FastAPI, Python, rasterio, Sentinel/Planet APIs
Blockchain	Solidity, Hardhat, Celo ContractKit, cUSD
Storage	IPFS (via web3.storage)
⚙️ Installation & Setup
1️⃣ Clone the Repository
git clone https://github.com/<your-username>/VeriLeaf.git
cd VeriLeaf

2️⃣ Install Dependencies
Frontend
cd frontend
npm install

Backend
cd ../backend
pip install -r requirements.txt

Smart Contracts
cd ../contracts
npm install

🌐 Environment Variables

Create a .env file in each folder as shown below:

/backend/.env

PLANET_API_KEY=your_planet_api_key
WEB3_STORAGE_TOKEN=your_ipfs_token
CELO_RPC_URL=https://alfajores-forno.celo-testnet.org


/frontend/.env.local

NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
NEXT_PUBLIC_CONTRACT_ADDRESS=your_deployed_contract_address

🧠 Run the Project
Start the Backend (FastAPI)
cd backend
uvicorn main:app --reload

Start the Frontend
cd frontend
npm run dev

Deploy Smart Contracts (Celo Alfajores)
cd contracts
npx hardhat compile
npx hardhat run scripts/deploy.js --network alfajores

💎 Features

Draw polygon on map → fetch satellite data

AI computes NDVI / vegetation gain / impact score

IPFS stores image + metadata

Smart contract mints Impact NFT

Auto-rewards user in cUSD if impact ≥ threshold

Public explorer for verified green projects

🧩 Folder Structure
VeriLeaf/
├── frontend/      # Next.js + Celo Wallet UI
├── backend/       # FastAPI AI analysis service
├── contracts/     # Solidity smart contracts
├── README.md
└── .env.example

🌱 License

MIT License © 2025 VeriLeaf Team



