
import { supabase, headers } from "../lib/supabase-js";

interface userAndPassword {
  email: string | null;
  password: string | null;
}

async function userLogin(data: userAndPassword) {
  const { error } = await supabase.auth.signInWithPassword({
    email: data.email as string,
    password: data.password as string,
  });
  return error;
}

async function userLogout() {
  const { error } = await supabase.auth.signOut();
  return error;
}

async function userAuthGet() {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  const claims = await supabase.auth.getClaims();
  return user;
}

async function userUpdatePassword(userId:string, current_password:string, password:string) {
  const { error } = await supabase.auth.updateUser({
    email: userId,
    current_password: current_password,
    password: password,
  });
  return error;
}

async function userUpdate(userData:Object) {
  const { error } = await supabase.auth.updateUser(userData);
  return error;
}

async function authGuard() {
  const user = await userAuthGet();
  if (user) return true; else return false;
}

export { 
  userLogin, 
  userLogout, 
  userAuthGet, 
  userUpdatePassword,
  userUpdate,
  authGuard,
 };
