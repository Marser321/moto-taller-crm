from playwright.sync_api import sync_playwright
import os

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Mock WhatsApp API
        page.route("**/webhook/api/whatsapp/send", lambda route: route.fulfill(
            status=200,
            body='{"success": true}',
            headers={"Content-Type": "application/json"}
        ))

        # Mock Supabase (for initial load if needed, though localstorage might be empty)
        # We can also mock `syncClientes` to populate data

        page.add_init_script("""
            window.localStorage.setItem('role', 'admin');

            // Mock clients
            const mockClients = [];
            for(let i=0; i<5; i++) {
                mockClients.push({
                    id: i,
                    nombre: 'Test Client ' + i,
                    telefono: '555000' + i,
                    matricula: 'MOCK ' + i,
                    fecha_vencimiento: new Date().toISOString().split('T')[0],
                    auxilios_usados: 0,
                    auxilios_total: 3
                });
            }
            // Override fetch for supabase if needed, or just push to variable after load
            // But easier to just override the variable in the console or after load
        """)

        file_path = os.path.abspath("production/admin/index.html")
        page.goto(f"file://{file_path}")

        # Inject data
        page.evaluate("""
            window.clientes = [
                {nombre: 'Ana Silva', telefono: '099111222', matricula: 'AAA 123', fecha_vencimiento: '2023-10-10'},
                {nombre: 'Beto Mendez', telefono: '099333444', matricula: 'BBB 456', fecha_vencimiento: '2023-12-01'},
                {nombre: 'Carla Diaz', telefono: '099555666', matricula: 'CCC 789', fecha_vencimiento: '2023-11-15'}
            ];
            renderTabla();
        """)

        # Open Campaign Modal
        page.click("button[title='Campañas']")

        # Select "Todos" (default)

        # Write Message
        page.fill("#campana-mensaje", "Hola {{nombre}}, prueba de performance.")

        # Generate Queue
        page.click("text=GENERAR COLA DE ENVÍO")

        # Start Campaign
        # Note: The button ID 'btn-start-campaign' is dynamically created
        page.click("#btn-start-campaign")

        # Wait a bit for processing (delay is 5s by default, let's speed it up or wait)
        # We can change delay dropdown value before starting
        page.select_option("#campaign-delay", "2000") # Select 2s

        # Wait for at least one item to be processed (green checkmark)
        page.wait_for_selector(".material-symbols-outlined:has-text('check_circle')", timeout=10000)

        # Take Screenshot
        os.makedirs("verification", exist_ok=True)
        screenshot_path = os.path.abspath("verification/campaign_processing.png")
        page.screenshot(path=screenshot_path)
        print(f"Screenshot saved to {screenshot_path}")

        browser.close()

if __name__ == "__main__":
    run()
