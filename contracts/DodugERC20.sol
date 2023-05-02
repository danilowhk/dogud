// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

interface IVerifier {
    function verify(uint256[] calldata pubInputs, bytes calldata proof) external view returns (bool);
}

contract Dodug is ERC20, Ownable {
    using SafeMath for uint256;

    uint256 public constant CLAIM_PERIOD = 7 days;
    uint256 public claimIdCounter;
    IVerifier public verifier;

    struct Claim {
        address claimant;
        uint256 amount;
        uint256 timestamp;
        bool contested;
        uint256 claimId;
    }

    mapping(uint256 => Claim) public claims;

    event Claimed(address indexed claimant, uint256 amount, uint256 claimId);
    event Contested(address indexed claimant, uint256 claimId);
    event ContestValidated(
        address indexed claimant,
        uint256 claimId,
        uint256 amount
    );
    event VerificationRequested(address indexed claimant, bytes proof);
    event VerificationSuccessful(address indexed claimant);

    constructor(address verifier_address) ERC20("Dodug", "DDG") {
        verifier = IVerifier(verifier_address);
    }

    function emitIncentives(uint256 amount, bytes memory proof) public {
        uint256 claimId = ++claimIdCounter;
        require(claims[claimId].timestamp == 0, "Claim already exists");

        uint256[] memory pubInputs = new uint256[](1);
        pubInputs[0] = uint256(msg.sender);
        require(verifier.verify(pubInputs, proof), "Invalid ZK proof");

        claims[claimId] = Claim(
            msg.sender,
            amount,
            block.timestamp,
            false,
            claimId
        );
        emit Claimed(msg.sender, amount, claimId);
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
            _mint(msg.sender, amount);
        } else {
            claims[claimId].contested = false;
            claims[claimId].timestamp = block.timestamp;
        }
    }

    function withdrawClaim() public {
        uint256 claimId = claims[msg.sender].claimId;
        require(claims[claimId].timestamp != 0, "Claim does not exist");
        require(!claims[claimId].contested, "Claim is contested");
        require(
            block.timestamp > claims[claimId].timestamp.add(CLAIM_PERIOD),
            "Claim period not over"
        );

        uint256 amount = claims[claimId].amount;
        delete claims[claimId];
        _mint(msg.sender, amount);
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
