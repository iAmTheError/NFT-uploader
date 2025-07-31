//SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";


contract NFT is ERC721, ERC721URIStorage, Ownable {
    uint256 public tokenId;
    event whatsTheTokenId(uint256 tokenNo);
    constructor() ERC721("NFT", "cNFT") Ownable(msg.sender) {
        tokenId = 0;
    }
    function mint(string memory nftURI,address owner)public returns (uint256) {
        require(bytes(nftURI).length > 0, "Has to be a valid NFT URL");
        require(owner != address(0), "Owner address cannot be zero");
        tokenId++;
        require(!minted(tokenId),"NFT at this Id already exists, this is not your mistake");
        _safeMint(owner,tokenId);
        _setTokenURI(tokenId,nftURI);

        emit whatsTheTokenId(tokenId);
        return tokenId;
    }
    function viewNFT(uint256 tkId) public view returns (address,uint256,string memory) {
        require(minted(tkId), "Valid token ID required");
        address ownedBy = ownerOf(tkId);
        uint256 tokensOwned = balanceOf(ownedBy);
        string memory url = tokenURI(tkId);
        return (ownedBy, tokensOwned, url);
    }

    function minted(uint256 tkId) internal view returns (bool) {
    return _ownerOf(tkId) != address(0);
}


        //Overriding

    function tokenURI(uint256 tokenId_) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId_);
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}   