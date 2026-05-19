use tauri::{
    Manager, WindowEvent,
};

#[tauri::command]
fn hide_to_tray(window: tauri::Window) -> Result<(), String> {
    window.hide().map_err(|e| format!("隐藏窗口失败: {}", e))
}

#[tauri::command]
fn open_folder(path: String) -> Result<(), String> {
    // 使用spawn而不是output，不检查返回状态
    std::process::Command::new("explorer")
        .arg(&path)
        .spawn()
        .map_err(|e| format!("打开文件夹失败: {}", e))?;
    
    Ok(())
}

fn create_tray(app: &tauri::App) -> Result<(), Box<dyn std::error::Error>> {
    use tauri::menu::{Menu, MenuItem};
    use tauri::tray::{TrayIconBuilder, TrayIconEvent, MouseButton, MouseButtonState};

    let show = MenuItem::with_id(app, "show", "显示窗口", true, None::<&str>)?;
    let quit = MenuItem::with_id(app, "quit", "退出", true, None::<&str>)?;
    let menu = Menu::with_items(app, &[&show, &quit])?;

    let _tray = TrayIconBuilder::new()
        .icon(app.default_window_icon().cloned().unwrap())
        .menu(&menu)
        .tooltip("Tauri App")
        .show_menu_on_left_click(false)
        .on_tray_icon_event(move |tray, event| {
            if let TrayIconEvent::Click { button: MouseButton::Left, button_state: MouseButtonState::Up, .. } = event {
                if let Some(window) = tray.app_handle().get_webview_window("main") {
                    let _ = window.show();
                    let _ = window.set_focus();
                }
            }
        })
        .on_menu_event(|app, event| {
            if event.id.as_ref() == "quit" {
                app.exit(0);
            } else if event.id.as_ref() == "show" {
                if let Some(window) = app.get_webview_window("main") {
                    let _ = window.show();
                    let _ = window.set_focus();
                }
            }
        })
        .build(app)?;

    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_shell::init())
        .setup(|app| {
            create_tray(app)?;

            let window = app.get_webview_window("main").unwrap();

            let window_clone = window.clone();
            window.on_window_event(move |event| {
                if let WindowEvent::CloseRequested { api, .. } = event {
                    api.prevent_close();
                    let _ = window_clone.hide();
                }
            });

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            hide_to_tray,
            open_folder,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
