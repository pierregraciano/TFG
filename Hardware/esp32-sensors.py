import machine
import dht
import time
import network
import urequests
import ujson
import ntptime

TIMEZONE_OFFSET = -3
INTERVALO_S = 3 * 60 * 60 * 1000  # 3 horas em milissegundos (para deep sleep)

# Configuração WiFi
SSID = '...'
PASSWORD = '...'

# Supabase
SUPABASE_URL = '...'
SUPABASE_API_KEY = '...'
SUPABASE_TABLE = '...'

# Sensores
dht_pin = machine.Pin(32)
sensor_dht = dht.DHT11(dht_pin)
adc_pin = 35
sensor_umidade = machine.ADC(machine.Pin(adc_pin))
sensor_umidade.atten(machine.ADC.ATTN_11DB)

def connect_wifi():
    sta_if = network.WLAN(network.STA_IF)
    if not sta_if.isconnected():
        print('Conectando ao WiFi...')
        sta_if.active(True)
        sta_if.connect(SSID, PASSWORD)
        while not sta_if.isconnected():
            pass
    print('Conectado!')

def get_time():
    try:
        ntptime.settime()
        tm = time.localtime(time.time() + (TIMEZONE_OFFSET * 3600))
        return "{:02d}/{:02d}/{} {:02d}:{:02d}:{:02d}".format(
            tm[2], tm[1], tm[0], tm[3], tm[4], tm[5])
    except Exception as e:
        print("Erro ao obter data/hora:", e)
        return "Data/Hora Indisponível"

def send_to_supabase(temperatura, umidade_ar, umidade_solo):
    url = f"{SUPABASE_URL}/rest/v1/{SUPABASE_TABLE}"
    payload = {
        "date": get_time(), 
        "temperatura": temperatura,
        "umidadeAr": umidade_ar,
        "umidadeSolo": umidade_solo
    }
    headers = {
        "apikey": SUPABASE_API_KEY,
        "Authorization": f"Bearer {SUPABASE_API_KEY}",
        "Content-Type": "application/json",
        "Prefer": "return=minimal"
    }

    try:
        response = urequests.post(url, headers=headers, data=ujson.dumps(payload))
        print("Dados enviados:", response.status_code)
        response.close()
    except Exception as e:
        print("Erro ao enviar para Supabase:", str(e))

# Programa principal
connect_wifi()

try:
    sensor_dht.measure()
    temperatura = (0.917*sensor_dht.temperature()) + 4.46
    umidade_ar = (0.696*sensor_dht.humidity()) + 15.2
    umidade_solo_raw = sensor_umidade.read()
    umidade_solo = 100 - (umidade_solo_raw / 4095 * 100)
        
    print(f"Temperatura: {temperatura}°C, Umidade do Ar: {umidade_ar}%, Umidade do Solo: {umidade_solo}%")
    send_to_supabase(temperatura, umidade_ar, umidade_solo)

except Exception as e:
    print("Erro ao ler sensores:", str(e))

# Coloca o ESP32 em deep sleep por 3 horas
print("Entrando em deep sleep por 3 horas...")
machine.deepsleep(INTERVALO_S)

