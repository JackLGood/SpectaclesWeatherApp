// ChatGPTAI.js
// no @input for weatherResponse any more!
// @input Component.Text outputDisplay

function requestGPT() {
    var raw = global.weatherResponse;
    if (!raw) {
        print("❌ No weather JSON available yet");
        return;
    }

    print("📨 Asking GPT about:\n" + raw);

    const request = {
      temperature: 1,
      messages: [{ role: 'user', content: raw }]
    };

    global.chatGpt.completions(request, (err, resp) => {
      if (!err && resp.choices) {
        var answer = resp.choices[0].message.content;
        print(answer);
        script.outputDisplay.text = answer;
      } else {
        print("❌ GPT error", err, resp);
      }
    });
}

script.createEvent('TapEvent').bind(requestGPT);