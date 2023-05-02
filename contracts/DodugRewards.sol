// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "./DodugToken.sol"; // assuming that you have a ERC20 token contract called DodugToken.sol

contract DodugRewards is Ownable {
    using SafeMath for uint256;

    uint256 public constant CLAIM_PERIOD = 7 days;
    Dodug private _dodugToken;
    mapping(address => bool) public verified;

    struct RewardClaim {
        address claimant;
        uint256 amount;
        uint256 timestamp;
        bool contested;
    }

    mapping(address => RewardClaim) public claims;

    event RewardClaimed(address indexed claimant, uint256 amount);
    event RewardContested(address indexed claimant);
    event RewardContestValidated(address indexed claimant, uint256 amount);
    event RewardVerificationRequested(address indexed claimant, bytes proof);
    event RewardVerificationSuccessful(address indexed claimant);

    constructor(address dodugToken) {
        _dodugToken = Dodug(dodugToken);
    }

    function claimReward(uint256 amount, bytes memory proof) public {
        require(claims[msg.sender].timestamp == 0, "Claim already exists");
        require(verifyZKProof(msg.sender, proof), "Invalid ZK proof");

        claims[msg.sender] = RewardClaim(
            msg.sender,
            amount,
            block.timestamp,
            false
        );
        emit RewardClaimed(msg.sender, amount);
    }

    function contestReward() public {
        RewardClaim storage claim = claims[msg.sender];
        require(claim.timestamp != 0, "Claim does not exist");
        require(!claim.contested, "Claim already contested");
        require(
            block.timestamp <= claim.timestamp.add(CLAIM_PERIOD),
            "Contest period is over"
        );

        claim.contested = true;
        emit RewardContested(msg.sender);
    }

    function validateRewardContest(bool isValid) public onlyOwner {
        RewardClaim storage claim = claims[msg.sender];
        require(claim.timestamp != 0, "Claim does not exist");
        require(claim.contested, "Claim not contested");

        if (isValid) {
            uint256 amount = claim.amount;
            delete claims[msg.sender];
            emit RewardContestValidated(msg.sender, amount);
            _dodugToken.mint(msg.sender, amount);
        } else {
            claim.contested = false;
            claim.timestamp = block.timestamp;
        }
    }

    function withdrawReward() public {
        RewardClaim storage claim = claims[msg.sender];
        require(claim.timestamp != 0, "Claim does not exist");
        require(!claim.contested, "Claim is contested");
        require(
            block.timestamp > claim.timestamp.add(CLAIM_PERIOD),
            "Claim period not over"
        );

        uint256 amount = claim.amount;
        delete claims[msg.sender];
        _dodugToken.transfer(msg.sender, amount);
    }

    function setVerificationStatus(address user, bool status) public onlyOwner {
        verified[user] = status;
    }

    function verifyZKProof(
        address user,
        bytes memory proof
    ) internal returns (bool) {
        // ZK verification - To be implemented
        emit RewardVerificationRequested(user, proof);
        return true;
    }
}
