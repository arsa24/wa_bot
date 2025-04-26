use napi_derive::napi;

#[napi]
pub fn read_plugins(a: i8, b: i8) -> i8 {
    a + b
}
