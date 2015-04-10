boolean startReadingLed = false;
boolean startReadingBaum = false;
boolean ledStatus = false;

void setup() {
  // put your setup code here, to run once:
  pinMode(13, OUTPUT);
   // initialize serial communication:
  Serial.begin(9600);
  Serial1.begin(9600);
  // set the serial receive timeout to 10ms:
  Serial1.setTimeout(10);  

}

void loop() {
  // build string for status information to send via serialport to webserver
  digitalWrite(13, ledStatus);
  if (digitalRead(13)) {
    Serial1.write("LED#1\r");
  } else {
    Serial1.write("LED#0\r");
  }
  if (Serial1.available()) {
    // get the new byte:
    char inChar = (char)Serial1.read(); 
    // init variables
    if (inChar == '/n') { 
      startReadingBaum = false;
      startReadingLed = false;
    }
    // react on command from webserver and switches led on/off
    if (startReadingLed){
      if(inChar == '1'){
        ledStatus = true;
      } else if (inChar == '0') {
        ledStatus = false;
      }
    }
    // proof of for different commands like led or tree
    if (inChar == 'L') {
      startReadingLed = true;
    } else if (inChar == 'B') {
      startReadingBaum = true;
      startReadingLed = false;
    }
    //sends commands to webserver
    Serial.print(inChar); 
  }
}
