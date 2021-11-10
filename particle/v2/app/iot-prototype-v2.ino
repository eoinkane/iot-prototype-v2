/*
 * Initial Author: ryand1011 (https://github.com/ryand1011)
 *
 * Reads data written by a program such as "rfid_write_personal_data.ino"
 *
 * See: https://github.com/miguelbalboa/rfid/tree/master/examples/rfid_write_personal_data
 *
 * Uses MIFARE RFID card using RFID-RC522 reader
 * Uses MFRC522 - Library
 * -----------------------------------------------------------------------------------------
 *             MFRC522      Arduino       Arduino   Arduino    Arduino          Arduino
 *             Reader/PCD   Uno/101       Mega      Nano v3    Leonardo/Micro   Pro Micro
 * Signal      Pin          Pin           Pin       Pin        Pin              Pin
 * -----------------------------------------------------------------------------------------
 * RST/Reset   RST          9             5         D9         RESET/ICSP-5     RST
 * SPI SS      SDA(SS)      10            53        D10        10               10
 * SPI MOSI    MOSI         11 / ICSP-4   51        D11        ICSP-4           16
 * SPI MISO    MISO         12 / ICSP-1   50        D12        ICSP-1           14
 * SPI SCK     SCK          13 / ICSP-3   52        D13        ICSP-3           15
*/

#include <SPI.h>
#include <MFRC522.h>
#include <set>

constexpr uint8_t RST_PIN = 8;     // Configurable, see typical pin layout above
constexpr uint8_t SS_PIN = 7;     // Configurable, see typical pin layout above

MFRC522 mfrc522(SS_PIN, RST_PIN);   // Create MFRC522 instance

// Define the pins we're going to call pinMode on
int redLed = D3; // This one is the red led
int greenLed = D4; // This one is the green led
int inputpin = D2;	//used to read the Pushbutton

/**
 * Helper function to flash red led.
 */
int flash_red_led(String command) {
    Serial.println("DEBUG: Flashing RED led at pin (redLed) D3 for 5 seconds (5000 ms).\n");
    
    digitalWrite(redLed, HIGH); // turn on the led
    delay(5000);  // wait 5 seconds
    digitalWrite(redLed, LOW); // turn off the led
    
    return 0;
}

/**
 * Helper function to flash green led.
 */
int flash_green_led(String command) {
    Serial.println("DEBUG: Flashing GREEN led at pin (greenLed) D4 for 5 seconds (5000 ms).\n");
    
    digitalWrite(greenLed, HIGH); // turn on the led
    delay(5000);  // wait 5 seconds
    digitalWrite(greenLed, LOW); // turn off the led
    
    return 0;
}

//*****************************************************************************************//
void setup() {
  Serial.begin(9600);                                           // Initialize serial communications with the PC
  SPI.begin();                                                  // Init SPI bus
  mfrc522.PCD_Init();                                              // Init MFRC522 card
  Serial.println(F("Read personal data on a MIFARE PICC:"));    //shows in serial that it is ready to read
  
  // Initialize D0 + D7 pin as output
  // It's important you do this here, inside the setup() function rather than outside it or in the loop function.
  pinMode(redLed, OUTPUT);
  pinMode(greenLed, OUTPUT);
  pinMode(inputpin, INPUT);
  
  Particle.function("flashRedLed", flash_red_led);
  Particle.function("flashGreenLed", flash_green_led);
}


/**
 * Helper function to construct 3 character string from RFID PICC buffer.
 */
String id_buffer_to_string(byte* idBuffer)
{
  byte tes[4];
  char str[4];
  for (uint8_t i = 0; i < 4; i++)
  {
    if (idBuffer[i] != 32 && idBuffer[i] != 239 && idBuffer[i] != 191 && idBuffer[i] != 189)
    {
      tes[i] = idBuffer[i];
    }
    if (i == 3)
    {
        break;
    }
  }
  // Copy contents
  memcpy(str, tes, 4);
  // Append NULL terminator
  str[sizeof(tes)] = '\0';
  
  String nana(str);
  
  return nana;
}


//*****************************************************************************************//
void loop() {

  // Set up test data for the prototype
  std::set<std::string> g1;

  for (int i = 1; i <= 5; i++)
    g1.insert("00" + std::to_string(i));
    
  if(digitalRead(inputpin) == HIGH){
    Serial.println("Button pressed");
    flash_red_led("command");
    delay(2000);
    flash_green_led("command");
  }

  // Prepare key - all keys are set to FFFFFFFFFFFFh at chip delivery from the factory.
  MFRC522::MIFARE_Key key;
  for (byte i = 0; i < 6; i++) key.keyByte[i] = 0xFF;

  //some variables we need
  byte block;
  byte len;
  MFRC522::StatusCode status;

  //-------------------------------------------

  // Look for new cards
  if ( ! mfrc522.PICC_IsNewCardPresent()) {
    return;
  }

  // Select one of the cards
  if ( ! mfrc522.PICC_ReadCardSerial()) {
    return;
  }

  Serial.println(F("**Card Detected:**"));

  //-------------------------------------------

  mfrc522.PICC_DumpDetailsToSerial(&(mfrc522.uid)); //dump some details about the card

  //mfrc522.PICC_DumpToSerial(&(mfrc522.uid));      //uncomment this to see all blocks in hex

  //-------------------------------------------

  byte buffer1[18];

  block = 4;
  len = 18;

  //------------------------------------------- GET STAFF ID
  status = mfrc522.PCD_Authenticate(MFRC522::PICC_CMD_MF_AUTH_KEY_A, 4, &key, &(mfrc522.uid)); //line 834 of MFRC522.cpp file
  if (status != MFRC522::STATUS_OK) {
    Serial.print(F("Authentication failed: "));
    Serial.println(mfrc522.GetStatusCodeName(status));
    flash_red_led("command");
    return;
  }

  status = mfrc522.MIFARE_Read(block, buffer1, &len);
  if (status != MFRC522::STATUS_OK) {
    Serial.print(F("Reading failed: "));
    Serial.println(mfrc522.GetStatusCodeName(status));
    flash_red_led("command");
    return;
  }

  //---------------------------------------- GET JOB

  byte buffer2[18];
  block = 1;

  status = mfrc522.PCD_Authenticate(MFRC522::PICC_CMD_MF_AUTH_KEY_A, 1, &key, &(mfrc522.uid)); //line 834
  if (status != MFRC522::STATUS_OK) {
    Serial.print(F("Authentication failed: "));
    Serial.println(mfrc522.GetStatusCodeName(status));
    flash_red_led("command");
    return;
  }

  status = mfrc522.MIFARE_Read(block, buffer2, &len);
  if (status != MFRC522::STATUS_OK) {
    Serial.print(F("Reading failed: "));
    Serial.println(mfrc522.GetStatusCodeName(status));
    flash_red_led("command");
    return;
  }
  //----------------------------------------

  String s1 = id_buffer_to_string(buffer1);
  Serial.println("Card ID: " + s1);
  Serial.println(s1.c_str());
  
  String s2 = id_buffer_to_string(buffer2);
  Serial.println("Staff ID: " + s2);
  
  // ---------- logic section
  
  
  
  Serial.println(F("\n**End Reading**\n"));
  
  String zone = "A3";

  Particle.publish("iot-prototype-v2-card-tapped", String::format("{\"staffId\":\"%s\",\"cardId\":\"%s\",\"zone\":\"%s\"}", s2.c_str(), s1.c_str(), zone.c_str()));

  delay(1000); //change value if you want to read cards faster

  mfrc522.PICC_HaltA();
  mfrc522.PCD_StopCrypto1();
}
//*****************************************************************************************//
