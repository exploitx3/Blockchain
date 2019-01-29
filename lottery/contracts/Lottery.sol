pragma solidity ^0.5.3;

contract Lottery {
    address public manager;
    address payable[] public players;

    constructor() public {
        manager = msg.sender;
    }

    function enter() public payable {
        require(msg.value > 0.01 ether);
        players.push(msg.sender);
    }

    function random() private view returns (uint) {
        return uint(keccak256(abi.encodePacked(block.difficulty, now, players)));

    }

    function pickWinner() public payable restricted returns(address) {

        uint index = random() % players.length;
        address payable winner = players[index];

        winner.transfer(address(this).balance);
        players = new address payable[](0);

        return winner;
    }

    modifier restricted() {
        require(msg.sender == manager);
        _;
    }

    function getPlayers() public view returns(address payable[] memory) {
        return players;
    }
}