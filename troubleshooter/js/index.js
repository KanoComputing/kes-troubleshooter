var _extends = Object.assign || function (target) {for (var i = 1; i < arguments.length; i++) {var source = arguments[i];for (var key in source) {if (Object.prototype.hasOwnProperty.call(source, key)) {target[key] = source[key];}}}return target;};var _createClass = function () {function defineProperties(target, props) {for (var i = 0; i < props.length; i++) {var descriptor = props[i];descriptor.enumerable = descriptor.enumerable || false;descriptor.configurable = true;if ("value" in descriptor) descriptor.writable = true;Object.defineProperty(target, descriptor.key, descriptor);}}return function (Constructor, protoProps, staticProps) {if (protoProps) defineProperties(Constructor.prototype, protoProps);if (staticProps) defineProperties(Constructor, staticProps);return Constructor;};}();function _classCallCheck(instance, Constructor) {if (!(instance instanceof Constructor)) {throw new TypeError("Cannot call a class as a function");}}function _possibleConstructorReturn(self, call) {if (!self) {throw new ReferenceError("this hasn't been initialised - super() hasn't been called");}return call && (typeof call === "object" || typeof call === "function") ? call : self;}function _inherits(subClass, superClass) {if (typeof superClass !== "function" && superClass !== null) {throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);}subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } });if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;}var Question = function (_React$Component) {_inherits(Question, _React$Component);
  function Question(props) {_classCallCheck(this, Question);return _possibleConstructorReturn(this, (Question.__proto__ || Object.getPrototypeOf(Question)).call(this,
    props));
  }_createClass(Question, [{ key: "render", value: function render()
    {var _this2 = this;
      var listItems = [];var _loop = function _loop(
      buttonName) {
        listItems.push(
        React.createElement("button", {
            key: buttonName,
            value: buttonName,
            onClick: function onClick() {return _this2.props.answerQuestion(buttonName);} },

          buttonName));};for (var buttonName in this.props.data.options) {_loop(buttonName);

      }
      return (
        React.createElement("div", null,
          React.createElement("h2", null, this.props.data.question),
          listItems));


    } }]);return Question;}(React.Component);var


KnownIssue = function (_React$Component2) {_inherits(KnownIssue, _React$Component2);
  function KnownIssue(props) {_classCallCheck(this, KnownIssue);return _possibleConstructorReturn(this, (KnownIssue.__proto__ || Object.getPrototypeOf(KnownIssue)).call(this,
    props));
  }_createClass(KnownIssue, [{ key: "render", value: function render()
    {
      return (
        React.createElement("div", null,
          React.createElement("h2", null, this.props.data.question),
          React.createElement("p", null, "Solution: ", this.props.data.customer_solution),
          React.createElement("p", null, "Did this resolve your issue?"),
          React.createElement("button", { value: "true" }, "Yes"),
          React.createElement("button", { value: "false" }, "No")));


    } }]);return KnownIssue;}(React.Component);var


NewIssue = function (_React$Component3) {_inherits(NewIssue, _React$Component3);
  function NewIssue(props) {_classCallCheck(this, NewIssue);return _possibleConstructorReturn(this, (NewIssue.__proto__ || Object.getPrototypeOf(NewIssue)).call(this,
    props));
  }_createClass(NewIssue, [{ key: "render", value: function render()

    {
      return (
        React.createElement("div", null,
          React.createElement("h2", null, "This looks like a new issue!"),
          React.createElement("p", null, this.props.data.input),
          React.createElement("textarea", null),
          React.createElement("button", null, "Submit")));


    } }]);return NewIssue;}(React.Component);var


Step = function (_React$Component4) {_inherits(Step, _React$Component4);
  function Step(props) {_classCallCheck(this, Step);return _possibleConstructorReturn(this, (Step.__proto__ || Object.getPrototypeOf(Step)).call(this,
    props));
  }_createClass(Step, [{ key: "render", value: function render()

    {


      if (this.props.data.type == "known_issue") {
        return (
          React.createElement("div", { className: "step" },
            React.createElement(KnownIssue, {
              data: this.props.data,
              answerQuestion: this.props.answerQuestion })));



      } else if (this.props.data.type == "new_issue") {
        return (
          React.createElement("div", { className: "step" },
            React.createElement(NewIssue, {
              data: this.props.data,
              answerQuestion: this.props.answerQuestion })));



      } else {
        return (
          React.createElement("div", { className: "step" },
            React.createElement(Question, {
              data: this.props.data,
              answerQuestion: this.props.answerQuestion })));



      }
    } }]);return Step;}(React.Component);var


Troubleshooter = function (_React$Component5) {_inherits(Troubleshooter, _React$Component5);
  function Troubleshooter(props) {_classCallCheck(this, Troubleshooter);var _this6 = _possibleConstructorReturn(this, (Troubleshooter.__proto__ || Object.getPrototypeOf(Troubleshooter)).call(this,
    props));
    _this6.state = {
      session_id: Math.random().toString(36).substring(2, 15),
      history: [],
      stepNumber: 0,
      tree: [{ "question": "Which Kano kit are you having trouble with?", "type": "question", "options": { "Computer Kit Touch": 1, "Harry Potter Kano Coding Kit": 31, "Motion Sensor Kit": 56 }, "answer": "" }, { "question": " Make sure your kit is plugged into the power supply.", "type": "question", "options": { "OK": 2 }, "answer": "" }, { "question": " Did you get through the setup process and arrive at the dashboard?", "type": "question", "options": { "Yes": 3, "No": 10 }, "answer": "" }, { "question": " Does touch work?", "type": "question", "options": { "Yes": 4, "No": 7 }, "answer": "" }, { "question": " Did you recently have trouble updating?", "type": "question", "options": { "Yes": 5, "No": 6 }, "answer": "" }, { "question": " Sorry to hear that! Let's get you up and running.", "type": "known_issue", "diagnosis": " Update failed", "customer_solution": " Reinstall OS", "jira": "", "answer": "" }, { "question": " Can you tell us a bit more about your problem?", "type": "known_issue", "diagnosis": " Kano OS Usage Issue", "customer_solution": " Various", "jira": "", "answer": "" }, { "question": " Does the touchscreen work on another computer? Unplug the orange touchscreen cable from the Kano's brain and plug it into another computer with a USB port. Then try touching the CKT's screen. Does it move the mouse on the other computer?", "type": "question", "options": { "Yes": 8, "No": 9 }, "answer": "" }, { "question": " Your touchscreen seems to be working. Let's get you help from an agent.", "type": "known_issue", "diagnosis": " Touch still not working with functioning panel", "customer_solution": " Replace CKT.", "jira": "", "answer": "" }, { "question": " Your touchscreen appears to be faulty. Don't worry, we can get you a new one.", "type": "known_issue", "diagnosis": " Touch panel faulty", "customer_solution": " Replace touch panel.", "jira": " OS-576", "answer": "" }, { "question": " Did anything ever appear on the screen?", "type": "question", "options": { "Yes": 11, "No": 14 }, "answer": "" }, { "question": " Did you see a screen asking you to type cd rabbithole?", "type": "question", "options": { "Yes": 12, "No": 13 }, "answer": "" }, { "question": " Can you describe where you got stuck?", "type": "known_issue", "diagnosis": " Stuck in onboarding", "customer_solution": " Reboot. If that doesn't work, reburn SD card.", "jira": "", "answer": "" }, { "question": " Can you tell us what you saw on the screen?", "type": "known_issue", "diagnosis": " Stuck before onboarding", "customer_solution": " Reboot. If that doesn't work, reburn SD card.", "jira": "", "answer": "" }, { "question": " Do you have the power cable from the battery connected properly to the power hat?", "type": "question", "options": { "Yes": 15, "No": 30 }, "answer": "" }, { "question": " Hold down the button for 3 seconds. Does the Raspberry Pi's red light come on?", "type": "question", "options": { "Yes": 16, "No": 25 }, "answer": "" }, { "question": " Then you have power! Does a green blinking light come on?", "type": "question", "options": { "Yes": 17, "No": 22 }, "answer": "" }, { "question": " Try unplugging the HDMI cable from the CKT's screen and connecting it to another HDMI screen, and then powering on the Kano. Does Kano OS show up on that screen?", "type": "question", "options": { "Yes": 18, "No": 19 }, "answer": "" }, { "question": " Looks like there is an issue with your screen panel. Let's get you a new one.", "type": "known_issue", "diagnosis": " Faulty screen panel", "customer_solution": " Replace screen panel", "jira": "", "answer": "" }, { "question": " There is likely an issue with the HDMI cable. Try connecting the Pi with the CKT's screen using another HDMI cable. Does that fix it?", "type": "question", "options": { "Yes": 20, "No": 21 }, "answer": "" }, { "question": " Looks like there is an issue with your Kano HDMI cable. Let's get you a new one.", "type": "known_issue", "diagnosis": " Faulty HDMI cable", "customer_solution": " Replace HDMI cable.", "jira": "", "answer": "" }, { "question": " Sorry to hear that didn't help. Let's get you help from our team.", "type": "known_issue", "diagnosis": " Unknown CKT display issue", "customer_solution": " Phone troubleshooting", "jira": "", "answer": "" }, { "question": " then there is an issue with the SD card. Does the SD card have a crack in it or is it damaged in any way?", "type": "question", "options": { "Yes": 23, "No": 24 }, "answer": "" }, { "question": " Uh oh! That's not good. Let's get you a new SD card.", "type": "known_issue", "diagnosis": " Damaged SD card", "customer_solution": " Replace SD card.", "jira": "", "answer": "" }, { "question": " Looks like there is a good chance reinstalling the OS onto the SD card will help! Go to https://help.kano.me/hc/en-us/articles/360001063620-Kano-OS-Reinstalling-Our-Software", "type": "known_issue", "diagnosis": " Kano OS not installed correctly on SD card", "customer_solution": " Ask user to re-install Kano OS", "jira": "", "answer": "" }, { "question": " It seems there is an issue getting power to the Pi. Remove the power hat from the board and hold the power button again. Do the battery's lights turn on?", "type": "question", "options": { "Yes": 26, "No": 29 }, "answer": "" }, { "question": " Looks like the button works fine! Now put the power hat back on. Unplug the cable connecting the power hat and the battery. Take the USB cable plugged into the wall outlet and connect directly to the power hat. Does the Pi turn on immediately, causing red and green lights to blink?", "type": "question", "options": { "Yes": 27, "No": 28 }, "answer": "" }, { "question": " Looks like there is an issue with the battery. Let's get you a new one.", "type": "known_issue", "diagnosis": " Faulty battery", "customer_solution": " Replace battery.", "jira": "", "answer": "" }, { "question": " Looks like it could be an issue with the power supply, power hat, or Raspberry Pi.", "type": "known_issue", "diagnosis": " Unknown power issue", "customer_solution": " Phone troubleshooting", "jira": "", "answer": "" }, { "question": " Looks like there is an issue with the power hat. Let's get you a new one.", "type": "known_issue", "diagnosis": " Faulty power hat", "customer_solution": " Replace power hat.", "jira": "", "answer": "" }, { "question": " Please plug it in correctly. This should fix your issue.", "type": "known_issue", "diagnosis": " Power cable not plugged into the power hat correctly", "customer_solution": " Plug power cable into power hat.", "jira": "", "answer": "" }, { "question": " Have you been able to open the Kano App successfully?", "type": "question", "options": { "Yes": 32, "No": 49 }, "answer": "" }, { "question": " Have you been able to connect your Wand to the App?", "type": "question", "options": { "Yes": 33, "No": 38 }, "answer": "" }, { "question": " When you open up a challenge on the Play tab, do you see a colorful world on the right side of your screen?", "type": "question", "options": { "Yes": 34, "No": 37 }, "answer": "" }, { "question": " Great! If you set the wand on a table, does the wand drift off the screen?", "type": "question", "options": { "Yes": 35, "No": 36 }, "answer": "" }, { "question": " Sorry to hear that. Let's get you a new wand.", "type": "known_issue", "diagnosis": " Wand drifting", "customer_solution": " Replace wand PCB", "jira": "", "answer": "" }, { "question": " Can you tell us a bit more about your issue?", "type": "known_issue", "diagnosis": " Wand Usage Issue", "customer_solution": " Various", "jira": "", "answer": "" }, { "question": " Uh-oh. Looks like your device has trouble rendering graphics.", "type": "known_issue", "diagnosis": " WebGL Not Working", "customer_solution": " Try another device", "jira": "", "answer": "" }, { "question": " Try taking out the batteries and make sure they're the right way around. When you plug them in, does the wand show a rainbow animation?", "type": "question", "options": { "Yes": 39, "No": 48 }, "answer": "" }, { "question": " Great! Is the blue light solid or blinking?", "type": "question", "options": { "Solid": 40, "Blinking": 41 }, "answer": "" }, { "question": " Looks like the Wand is connected to your device but something isn't quite right. We recommend restarting. If that doesn't work let us know.", "type": "known_issue", "diagnosis": " Bluetooth connected to device but not working", "customer_solution": " Restart computer", "jira": "", "answer": "" }, { "question": " Does your device support Bluetooth Low Energy (BLE)?", "type": "question", "options": { "Yes": 42, "No": 47 }, "answer": "" }, { "question": " Try restarting the app. Is it able to connect now?", "type": "question", "options": { "Yes": 43, "No": 44 }, "answer": "" }, { "question": " Awesome!", "type": "known_issue", "diagnosis": " App needed to be restarted to connect to wand", "customer_solution": " Already solved", "jira": "", "answer": "" }, { "question": " Are you using Mac OS Mojave or High Sierra v10.13.16?", "type": "question", "options": { "Yes": 45, "No": 46 }, "answer": "" }, { "question": " These versions of MacOS have issues with Bluetooth. Try downloading the latest system updates and they should resolve your issue.", "type": "known_issue", "diagnosis": " Mac OS Bluetooth issues", "customer_solution": " Update to latest version of Mac OS", "jira": "", "answer": "" }, { "question": " Looks like there is something weird going on with your Bluetooth connection. Let's get you in touch with someone from our team who can help!", "type": "known_issue", "diagnosis": " Unknown Bluetooth issue", "customer_solution": " Phone troubleshooting", "jira": "", "answer": "" }, { "question": " Sorry, but Bluetooth Low Energy is required to connect to the Wand! Perhaps you can use a different device?", "type": "known_issue", "diagnosis": " Device doesn't support BLE", "customer_solution": " Try another device.", "jira": "", "answer": "" }, { "question": " Uh-oh. Let's get you in touch with someone from our team to get you help!", "type": "known_issue", "diagnosis": " Wand not turning on. Potential PCB issues.", "customer_solution": " Replace wand PCB", "jira": "", "answer": "" }, { "question": " Are using one of the following OS versions: Windows 7, 8, or 9, Android < v5.0, or iOS 9 or 10?", "type": "question", "options": { "Yes": 50, "No": 51 }, "answer": "" }, { "question": " Unfortunately we do not support those operating systems. Perhaps you can use a different device?", "type": "known_issue", "diagnosis": " Unsupported OS", "customer_solution": " Try another device.", "jira": "", "answer": "" }, { "question": " Were you able to download the Kano app?", "type": "question", "options": { "Yes": 52, "No": 55 }, "answer": "" }, { "question": " Were you able to install it successfully?", "type": "question", "options": { "Yes": 53, "No": 54 }, "answer": "" }, { "question": " What happened when you tried to open it?", "type": "known_issue", "diagnosis": " Unknown app starting issue", "customer_solution": " Phone troubleshooting", "jira": "", "answer": "" }, { "question": " What happened when you tried to install it?", "type": "known_issue", "diagnosis": " Unknown app installation issue", "customer_solution": " Phone troubleshooting", "jira": "", "answer": "" }, { "question": " To use the Wand you'll need our app. You can find the app at www.kano.me/app", "type": "known_issue", "diagnosis": " User didn't download app", "customer_solution": " User should download the app", "jira": "", "answer": "" }, { "question": " Did you get the app installed?", "type": "question", "options": { "Yes": 57, "No": 58 }, "answer": "" }, { "question": " Were you able to use the sensor in a challenge?", "type": "question", "options": {}, "answer": "" }, { "question": " Were you able to download it?", "type": "question", "options": { "Yes": 59, "No": 60 }, "answer": "" }, { "question": " What OS are you using?", "type": "question", "options": {}, "answer": "" }, { "question": " Looks like you need to download it here", "type": "known_issue", "diagnosis": " Didn\u2019t download app", "customer_solution": " Go to kano.me/app", "jira": " MSK-X", "answer": "" }] };return _this6;

  }_createClass(Troubleshooter, [{ key: "answerQuestion", value: function answerQuestion(

    answer) {var _this7 = this;
      this.setState({
        history: this.state.history.concat({
          question: this.state.stepNumber,
          answer: answer }),

        stepNumber: this.state.tree[this.state.stepNumber].options[answer] },
      function () {
        _this7.submitAnswers();
      });
    } }, { key: "jumpTo", value: function jumpTo(

    step) {
      this.setState({
        stepNumber: step });

    } }, { key: "restart", value: function restart()

    {
      this.setState({
        history: [],
        stepNumber: 0 });

    } }, { key: "submitAnswers", value: function submitAnswers()

    {

      // Get answers for the questions customers already andswered
      answers = [];
      for (var i = 0; i < this.state.history.length; i++) {
        var historyObject = this.state.history[i];
        var newObject = { "answer": historyObject.answer };
        var answerObject = _extends({}, this.state.tree[historyObject.question], newObject);
        answers.push(answerObject);
      }

      // If customers have arrived at a terminal node, go ahead and send that along (before they press the button telling us whether it worked or not!)
      var current = this.state.tree[this.state.stepNumber];
      if (current.type == "known_issue" || current.type == "new_issue") {
        answers.push(_extends({}, current));
      }

      var payload = {
        session_id: this.state.session_id,
        email: null,
        answers: answers,
        jira_key: "",
        resolved: null };

      console.log(payload);

      // Send off to the server
      fetch('https://troubleshooter.kano.me/', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json' },

        body: JSON.stringify(payload) });

    } }, { key: "answerHistory", value: function answerHistory()

    {
      answers = [];
      for (var i = 0; i < this.state.history.length; i++) {
        var item = this.state.history[i];
        var answer = this.state.tree[item.question].question + ": " + item.answer;
        answers.push(answer);
      }
      console.log(answers);
      return answers;
    } }, { key: "render", value: function render()

    {var _this8 = this;

      return (
        React.createElement("div", { className: "troubleshooter" },
          React.createElement("div", { className: "header" },
            React.createElement("img", { src: "https://world.kano.me/assets/images/kwc-masthead/kano-logo.svg", id: "logo" })),


          React.createElement(Step, {
            data: this.state.tree[this.state.stepNumber],
            answerQuestion: this.answerQuestion.bind(this),
            history: this.state,
            onClick: function onClick(i) {return _this8.handleClick(i);} }),

          React.createElement("div", { className: "footer" },
            React.createElement("a", { href: "#", onClick: function onClick() {return _this8.restart();} }, "Restart"), " |",
            React.createElement("a", { href: "#", onClick: function onClick() {return _this8.answerHistory();} }, "Get History"))));




    } }]);return Troubleshooter;}(React.Component);


ReactDOM.render(React.createElement(Troubleshooter, null), document.getElementById("root"));