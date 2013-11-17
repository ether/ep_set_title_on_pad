var settings = require('ep_etherpad-lite/node/utils/Settings');

exports.clientVars = function(hook, context, callback){
  /*
  var ep_prompt_for_name = {};
  try {
    if (settings.ep_prompt_for_name){
       if(!settings.ep_prompt_for_name.link){
         console.warn("No link set for ep_prompt_for_name, add ep_prompt_for_name.link to settings.json");
         ep_prompt_for_name.link = "https://github.com/JohnMcLear/ep_prompt_for_name";
       }else{
         ep_prompt_for_name.link = settings.ep_prompt_for_name.link;
       }
       if(!settings.ep_prompt_for_name.text){
         ep_prompt_for_name.text = "NO TEXT SET";
         console.warn("No text set for ep_prompt_for_name, add ep_prompt_for_name.text to settings.json");
       }else{
         ep_prompt_for_name.text = settings.ep_prompt_for_name.text;
       }
       if(!settings.ep_prompt_for_name.before){
         ep_prompt_for_name.before = "#timesliderlink";
         console.info("No before set for ep_prompt_for_name, this may be intentional, add ep_prompt_for_name.before to settings.json");
       }else{
         ep_prompt_for_name.before = settings.ep_prompt_for_name.before;
       }
       if(!settings.ep_prompt_for_name.classes){
         ep_prompt_for_name.classes = "grouped-left";
         console.info("No classes set for ep_prompt_for_name, this may be intentional, add ep_prompt_for_name.classes to settings.json");
       }else{
         ep_prompt_for_name.classes = settings.ep_prompt_for_name.classes;
       }
       if(!settings.ep_prompt_for_name.after){
         console.info("No after set for ep_prompt_for_name, this may be intentional, add ep_prompt_for_name.classes to settings.json");
       }else{
         ep_prompt_for_name.after = settings.ep_prompt_for_name.after;
       }

    }else{
      ep_prompt_for_name = {};
      ep_prompt_for_name.link = "https://github.com/JohnMcLear/ep_prompt_for_name";
      ep_prompt_for_name.text = "NO TEXT SET";
      ep_prompt_for_name.before = "#timesliderlink";
      ep_prompt_for_name.classes = "grouped-right";
      console.warn("No link set for ep_prompt_for_name, add ep_prompt_for_name.link to settings.json");
      console.warn("No text set for ep_prompt_for_name, add ep_prompt_for_name.text to settings.json");
    }
  } catch (e){
  }
  return callback({ep_prompt_for_name: ep_prompt_for_name});
  */
  return callback();
};
