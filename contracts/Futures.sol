contract BinaryFuture{
    
    struct Future{
        uint256 expires;
        uint256 buyIn;
        uint256 startValue;
        uint256 endValue;
        string query;
        address queryAddress;
        address long;
        address short;
        address winner;
        FuturesStage stage;        
    }
    
    enum FuturesStage{
        Unfilled,
        ReadyStart,
        ContractLive,
        ReadyEnd,
        ReadySettle
    }
    
    enum Positions{
        Long,
        Short
    }
    
    event Query(string queryString, address queryAddress);
    
    Future future;
    
    function BinaryFuture(
        uint256 expires, 
        uint256 buyIn, 
        string queryString, 
        address queryAddress){
            
        future.expires = expires;
        future.buyIn = buyIn;
        future.stage = FuturesStage.Unfilled;
        future.query = queryString;
        future.queryAddress = queryAddress;
    }

    //take "long" or "short" position with msg.value == future.buyIn
    function fillPosition(uint256 position) public payable {

    }
    
    //make query for future.startValue
    function startContract() public {

    }
    
    //make query for future.endValue
    function endContract() public {
        
    }
    
    //compare future.startValue with future.endValue, payout to and short proportionally
    function settleContract() public {
    
    }
    
    //emit query event
    function queryOracle(string stage, string query) internal {
     
    }
    
    //handle oracle response
    function oracleCallback(uint256 response){
        
    }
        
    //are positions unfilled =>Unfilled (0)    
    //is contract ready to start ( make query for future.startValue) =>ReadyStart (1)
    //is contract startValue set and is yet to expire =>ContractLive (2)
    //is contract ready to end (make query for future.endValue) =>ReadyEnd (3)
    //is contract ready to settle payouts via future.startValue and future.endValue =>ReadySettled (4)
    function getStatus() constant returns(FuturesStage stage){
        
    }        
        
    function getBuyIn() constant returns(uint256 buyIn){
        return future.buyIn;
    }   
        
    function getWinner() constant returns(address winner){
        return future.winner;
    }
    
    function getLong() constant returns(address long){
        return future.long;
    }

    function getShort() constant returns(address short){
        return future.short;
    }
    
}
