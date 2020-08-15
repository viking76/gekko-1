/*
   Manual Entry and Exit


   (CC-BY-SA 4.0) Alp Cevikel
   https://creativecommons.org/licenses/by-sa/4.0/
*/

// req's
var log = require ('../core/log.js');
var config = require ('../core/util.js').getConfig();

// strategy
var strat = {

   /* INIT */
   init: function()
   {
       this.name = 'Manual Entry & Exit';

       this.entryPrice = this.settings.ENTRY;
       this.exitPrice = this.settings.EXIT;
       this.stopPrice = this.settings.STOP_LOSS;
       this.tradeStarted = false;
       this.tradeCompleted = false;
       this.firstRun = true;

       if (! (this.exitPrice > this.entryPrice && this.stopPrice < this.entryPrice)) {
         console.log("Entry/Exit/Stop values doesn't make any sense. Ignoring!");
         this.tradeCompleted = true;
         this.firstRun = false;
         return;
       }
       // debug? set to flase to disable all logging (improves performance)
       console.log("Running AC $$ MAKER for PROZ. Entry:" +this.entryPrice + " Exit:"+this.exitPrice);
   }, // init()


   /* CHECK */
   check: function()
   {
     if (this.firstRun) {
       this.firstRun = false;
       if (this.candle.close <= this.entryPrice) {
          console.log("The strategy will immediately enter trade. Looks bad. Ignoring all candles!");
          this.tradeCompleted = true;
       }
     }

     if (this.tradeCompleted) {
       return;
     }


      if (this.tradeStarted) { // We've started the trade
        if (this.candle.close >= this.exitPrice) {
          this.advice('short');
          console.log("Exited trade at: "+ this.candle.close);
          this.tradeCompleted = true;
        }

        if (this.candle.close <= this.stopPrice) {
          this.advice('short');
          console.log("Stop loss at: "+ this.candle.close);
          this.tradeCompleted = true;
        }

      } else { // Looking for an entry point
        if (this.candle.close <= this.entryPrice) {
          this.advice('long');
          console.log("Entered trade at: "+ this.candle.close);
          this.tradeStarted = true;
        }
      }

   }, // check()

   /* END backtest */
   end: function(){
    console.log("BACKTEST DONE!");
   }

};

module.exports = strat;
