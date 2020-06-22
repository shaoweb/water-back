// http://58.246.211.154:14200/wcp/
const API = 'http://58.246.211.154:14200/wcp/';
// const API = 'http://192.168.1.117:8088/wcp/';

export const APIROUTER = {
    login: API + 'user/login', //登录
    uploadImg: API + 'pro/uploadImg', //图片上传
    uploadVideo: API + 'pro/uploadVideo', //视频上传
    getProject: API + 'pro/getProject', //查询某个项目的详细信息
    getProjects: API + 'pro/getProjects', //查询所有工程
    addProject: API + 'pro/addProject', //添加工程信息
    getWcp: API + 'wcp/getWcp', //获取工程类型
    getArea: API + 'area/getArea', //获取行政区
    updateProject: API + 'pro/updateProject', //更新工程信息
    addPara: API + 'para/addPara', //工程现状，安全复核新增
    addDanger: API + 'adn/addDanger', //工程险情新增
    addMaintain: API + 'mai/addMaintain', //工程维修、加固新增
    addStru: API + 'para/addStru', //安全检测新增
    getStruValue: API + 'para/getStruValue', //安全检测查询
    getAreaInfoTree: API + 'area/getAreaInfoTree', // 省市区三级联动
    exportPro: API + 'excel/exportPro', //excel模板下载
    importPro: API + 'excel/importPro', //excel模板导入
    deleteImg: API + 'pro/deleteImg', //图片删除
    addRecord: API + 'record/addRecord', //行业新闻，系统通知，标准规范，工程档案新增
}

// 公用方法配置
export class ClusterThe {

    // 取cookie的值,传入你要取得cookie值的名字
    getCookie(value: string): string {
        var aCookie = document.cookie.split(";"); // 将所有cookie键值对通过分号分割为数组;
        // 循环遍历所有cookie键值对
        for (var i = 0; i < aCookie.length; i++) {
            // 有些cookie键值对前面会莫名其妙产生一个空格，将空格去掉
            if (aCookie[i].indexOf(" ") == 0) {
                aCookie[i] = aCookie[i].substring(1);
            }
            var aCrumb = aCookie[i].split("="); // 将每个cookie键值对通过等号分割为数组;
            if (value == aCrumb[0]) // 比较每个cookie的名称，找到要的那个cookie键值对
                return unescape(aCrumb[1]);
        }
        return null;
    };

    // 删除cookie值
    removeCookie(cookieName: any): void {
        let cookies = document.cookie.split(";"); // 将所有cookie键值对通过分号分割为数组;
        // 循环遍历所有cookie键值对
        for (let i = 0; i < cookies.length; i++) {
            // 有些cookie键值对前面会莫名其妙产生一个空格，将空格去掉
            if (cookies[i].indexOf(" ") == 0) {
                cookies[i] = cookies[i].substring(1);
            }
            // 比较每个cookie的名称，找到要删除的那个cookie键值对
            if (cookies[i].indexOf(cookieName) == 0) {
                let exp = new Date(); // 获取客户端本地当前系统时间
                exp.setTime(exp.getTime() - 60 * 1000); // 将exp设置为客户端本地时间1分钟以前，将exp赋值给cookie作为过期时间后，就表示该cookie已经过期了,
                // 那么浏览器就会将其立刻删除掉
                document.cookie = cookies[i] + ";expires=" + exp.toUTCString(); // 设置要删除的cookie的过期时间，即在该cookie的键值对后面再添加一个expires键值对，并将上面的exp赋给expires作为值(注意expires的值必须为UTC或者GMT时间，不能用本地时间），那么浏览器就会将该cookie立刻删除掉
                // 注意document.cookie的用法很巧妙，在对其进行赋值的时候是设置单个cookie的信息，但是获取document.cookie的值的时候是返回所有cookie的信息
                break; // 要删除的cookie已经在客户端被删除掉，跳出循环
            }
        }
    };

    // 返回当前时间
    currentDate(date: string, type?: string): string {
        if (date != null && date != "") {
            let yer: string | number,
                month: string | number,
                day: string | number,
                HH: string | number,
                mm: string | number,
                ss: string | number;
            let time = new Date(date), timeDate: string;
            yer = time.getFullYear();
            month = time.getMonth() + 1;
            day = time.getDate();
            HH = time.getHours(); //获取系统时，
            mm = time.getMinutes(); //分
            ss = time.getSeconds(); //秒

            month = (month < 10) ? ('0' + month) : month;
            day = (day < 10) ? ('0' + day) : day;

            switch (type) {
                case 'yyyy-MM-dd':
                    timeDate = yer + '-' + month + '-' + day;
                    break;
                case 'yyyy/MM/dd':
                    timeDate = yer + '/' + month + '/' + day;
                    break;
                case 'yyyy-MM-dd HH:mm:ss':
                    timeDate = yer + '-' + month + '-' + day + ' ' + HH + ':' + mm + ':' + ss;
                    break;
                default:
                    timeDate = yer + '-' + month + '-' + day;
                    break;
            }
            return timeDate
        } else {

            return ''
        }
    };
}