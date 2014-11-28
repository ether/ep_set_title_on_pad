describe("Set Title On Pad", function(){

  //create a new pad before each test run
  beforeEach(function(cb){
    testPad = helper.newPad(cb);
    this.timeout(60000);
  });

  // Create Pad
   // Check Default Pad Title is Untitled
    // Set Pad title & Ensure it's right
     // Re-open Pad and check Pad Title is stored.

  it("Checked Default Pad Title is 'Untitled Pad'", function(done) {
    this.timeout(60000);
    var chrome$ = helper.padChrome$;
    if(chrome$('#options-pageview').attr("checked")) chrome$('#options-pageview').click();
    var $editorContainer = chrome$("#editorcontainer");
    chrome$("#edit_title").click();
    chrome$("#input_title").val("JohnMcLear");
    chrome$("#save_title").click();


    helper.waitFor(function(){
      return chrome$("#pad_title > #title > h1").text() === "JohnMcLear";
    }).done(function(){
      expect(chrome$("#pad_title > #title > h1").text()).to.be("JohnMcLear");
      done();
    });
  });

  it("Check updating pad title to 'JohnMcLear' works", function(done) {
    this.timeout(60000);
    var chrome$ = helper.padChrome$;
    if(chrome$('#options-pageview').attr("checked")) chrome$('#options-pageview').click();
    var $editorContainer = chrome$("#editorcontainer");
    chrome$("#edit_title").click();
    chrome$("#input_title").val("JohnMcLear");
    chrome$("#save_title").click();

    setTimeout(function() {
      // go to timeslider
      $('#iframe-container iframe').attr('src', $('#iframe-container iframe').attr('src'));

      setTimeout(function() {
        var chrome$ = $('#iframe-container iframe')[0].contentWindow.$;
        helper.waitFor(function(){
          return chrome$("#pad_title > #title > h1").text() === "JohnMcLear";
        }).done(function(){
          expect(chrome$("#pad_title > #title > h1").text()).to.be("JohnMcLear");
          done();
        });
      }, 2000);
    }, 1000);

  });

});
