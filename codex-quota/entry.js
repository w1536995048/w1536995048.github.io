const status = document.getElementById("status");
const enter = document.getElementById("enter");
const refresh = document.getElementById("refresh");
async function load() {
  refresh.disabled=true; enter.hidden=true; enter.removeAttribute("href");
  status.textContent="正在获取最新访问地址…";
  try {
    const response=await fetch(`current.json?t=${Date.now()}`,{cache:"no-store",credentials:"omit",redirect:"error"});
    if (!response.ok) throw Error();
    const data=await response.json();
    const url=new URL(data.url);
    if (url.protocol!=="https:" || url.username || url.password || url.port ||
      !/^[a-z0-9-]+\.(trycloudflare\.com|ngrok-free\.(app|dev))$/.test(url.hostname) ||
      url.pathname!=="/login" || url.search || url.hash || !Number.isFinite(data.updatedAt)) throw Error();
    enter.href=url.href; enter.hidden=false;
    status.textContent="已读取电脑最后发布的地址。点击下方按钮进入。";
    document.getElementById("updated").textContent=`地址更新于：${new Date(data.updatedAt).toLocaleString("zh-CN",{hour12:false})}。此时间不是额度更新时间。`;
  } catch { status.textContent="暂时无法获取地址，请稍后重试。首次部署需要等待 GitHub Pages 发布；也请确认电脑已启动手机访问服务。"; }
  finally { refresh.disabled=false; }
}
refresh.addEventListener("click",()=>void load());
document.addEventListener("visibilitychange",()=>{if(!document.hidden)void load();});
void load();
