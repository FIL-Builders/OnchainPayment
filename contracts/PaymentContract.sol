// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.8.2 <0.9.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract PaymentContract {
    address paymentToken;
    address private owner;

    // event for FEVM logging
    event OwnerChanged(address indexed oldOwner, address indexed newOwner);
    event PaymentReceived(address indexed payer, address indexed token, uint256 indexed amount);
    event PaymentWithdrew(address indexed receiver, uint256 indexed amount);

    constructor(address _token) {
        paymentToken = _token;
        owner = msg.sender; // 'msg.sender' is sender of current call, contract deployer for a constructor
        emit OwnerChanged(address(0), owner);
    }

    /**
     * Pay and withdraw using ERC20 token
     */
    function payWithErc20(uint256 amount){
        require(IERC20(paymentToken).transferFrom(msg.sender, address(this), amount), "Payment failed");
        emit PaymentReceived(msg.sender,paymentToken, amount);
        // Additional payment logic
        // (e.g., updating balances)
        // (e.g., updating storage plan)
    }

    function withdrawErc20(uint256 amount) public isOwner{
        // We can add some payment logic here before paying out. 
        // For example, proof of storage deal, etc.
        require(IERC20(paymentToken).balanceOf(address(this)) >= amount, "Not enought balance");
        require(IERC20(paymentToken).transfer(msg.sender, amount), "Withdrawal failed");
        emit PaymentWithdrew(msg.sender,amount);
    }

    function getErc20tBalance() public isOwner view returns(uint){
        return IERC20(paymentToken).balanceOf(address(this));
    }

    /**
     * Pay and withdraw native FIL
     */
    function payWithFIL() public payable {
        emit PaymentReceived(msg.sender,paymentToken, msg.value );
    }

    function releaseFIL(address payable to, uint256 amount) external isOwner {
        require(address(this).balance >= amount, "Not enought FIL balance");
        to.transfer(amount);
        emit PaymentWithdrew(to,amount);
    }

    function getFILBalance() public isOwner view returns (uint) {
        return address(this).balance;
    }

    /**
     * @dev Return accepted token address 
     * @return token address
     */
    function getPaymentToken() external view returns (address) {
        return paymentToken;
    }

    /**
     * @dev Change owner
     * @param newOwner address of new owner
     */
    function changeOwner(address newOwner) public isOwner {
        emit OwnerChanged(owner, newOwner);
        owner = newOwner;
    }

    /**
     * @dev Return owner address 
     * @return address of owner
     */
    function getOwner() external view returns (address) {
        return owner;
    }

    // modifier to check if caller is owner
    modifier isOwner() {
        // If the first argument of 'require' evaluates to 'false', execution terminates and all
        // changes to the state and to Ether balances are reverted.
        // This used to consume all gas in old EVM versions, but not anymore.
        // It is often a good idea to use 'require' to check if functions are called correctly.
        // As a second argument, you can also provide an explanation about what went wrong.
        require(msg.sender == owner, "Caller is not owner");
        _;
    }
}