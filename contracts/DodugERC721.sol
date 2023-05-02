// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract Dodug is ERC721, Ownable {
    using Counters for Counters.Counter;
    using SafeMath for uint256;

    uint256 public constant CLAIM_PERIOD = 7 days;
    Counters.Counter private _tokenIdCounter;
    uint256 private _claimIdCounter;

    struct Claim {
        address claimant;
        uint256 amount;
        uint256 timestamp;
        bool contested;
        uint256 claimId;
        uint256 tokenId;
    }

    mapping(uint256 => Claim) public claims;
    mapping(address => bool) public verified;

    event Claimed(
        address indexed claimant,
        uint256 amount,
        uint256 claimId,
        uint256 tokenId
    );
    event Contested(address indexed claimant, uint256 claimId);
    event ContestValidated(
        address indexed claimant,
        uint256 claimId,
        uint256 amount
    );
    event VerificationRequested(address indexed claimant, bytes proof);
    event VerificationSuccessful(address indexed claimant);

    constructor() ERC721("Dodug", "DDG") {}

    function safeMint(address to) public onlyOwner {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
    }

    function claimTokens(
        uint256 tokenId,
        uint256 amount,
        bytes memory proof
    ) public {
        require(
            ownerOf(tokenId) == msg.sender,
            "Only the token owner can claim tokens"
        );
        uint256 claimId = ++_claimIdCounter;
        require(claims[claimId].timestamp == 0, "Claim already exists");
        require(verifyZKProof(msg.sender, proof), "Invalid ZK proof");

        claims[claimId] = Claim(
            msg.sender,
            amount,
            block.timestamp,
            false,
            claimId,
            tokenId
        );
        emit Claimed(msg.sender, amount, claimId, tokenId);
    }

    function contestClaim(uint256 claimId) public {
        require(claims[claimId].timestamp != 0, "Claim does not exist");
        require(!claims[claimId].contested, "Claim already contested");
        require(
            block.timestamp <= claims[claimId].timestamp.add(CLAIM_PERIOD),
            "Contest period is over"
        );

        claims[claimId].contested = true;
        emit Contested(claims[claimId].claimant, claimId);
    }

    function validateContest(uint256 claimId, bool isValid) public onlyOwner {
        require(claims[claimId].timestamp != 0, "Claim does not exist");
        require(claims[claimId].contested, "Claim not contested");

        if (isValid) {
            uint256 amount = claims[claimId].amount;
            delete claims[claimId];
            emit ContestValidated(msg.sender, claimId, amount);
            _mint(msg.sender, claims[claimId].tokenId);
        } else {
            claims[claimId].contested = false;
            claims[claimId].timestamp = block.timestamp;
        }
    }

    function withdrawClaim(uint256 claimId) public {
        require(claims[claimId].timestamp != 0, "Claim does not exist");
        require(!claims[claimId].contested, "Claim is contested");
        require(
            block.timestamp > claims[claimId].timestamp.add(CLAIM_PERIOD),
            "Claim period not over"
        );

        uint256 tokenId = claims[claimId].tokenId;
        address tokenOwner = ownerOf(tokenId);
        require(
            tokenOwner == msg.sender,
            "Only the token owner can withdraw claim"
        );

        uint256 amount = claims[claimId].amount;
        delete claims[claimId];
        _mint(msg.sender, tokenId);
        _mint(tokenOwner, amount);
    }

    function setVerificationStatus(address user, bool status) public onlyOwner {
        verified[user] = status;
    }

    function verifyZKProof(
        address user,
        bytes memory proof
    ) internal returns (bool) {
        // ZK verification - To be implemented
        emit VerificationRequested(user, proof);
        return true;
    }
}
