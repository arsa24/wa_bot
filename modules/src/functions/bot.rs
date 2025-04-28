use napi_derive::napi;
use std::{fs, path::Path};

#[napi]
pub fn read_plugins(path_plugin: String) -> napi::Result<Vec<String>> {
    let mut files = Vec::new();
    let path = Path::new(&path_plugin);
    visit_dirs(path, &mut files)?;

    Ok(files)
}

fn visit_dirs(dir: &Path, files: &mut Vec<String>) -> napi::Result<()> {
    if dir.is_dir() {
        for entry in fs::read_dir(dir).map_err(|e| napi::Error::from_reason(e.to_string()))? {
            let entry = entry.map_err(|e| napi::Error::from_reason(e.to_string()))?;
            let path = entry.path();

            if path.is_dir() {
                visit_dirs(&path, files)?;
            }

            if path.is_file() {
                if let Some(ext) = path.extension() {
                    if ext == "js" || ext == "ts" {
                        if let Some(fname) = path.to_str() {
                            let fixed = fname.replace("\\", "/");
                            files.push(fixed);
                        }
                    }
                }
            }
        }
    }
    Ok(())
}

#[napi]
pub fn matching_plugin(
    command: String,
    triggers: Vec<String>,
    prefixes: Vec<String>,
) -> bool {
    let command_lower = command.to_lowercase();
    for prefix in prefixes {
        for trigger in &triggers {
            let pattern = format!("{}{}", prefix.to_lowercase(), trigger.to_lowercase());
            if command_lower == pattern {
                return true;
            }
        }
    }
    false
}

