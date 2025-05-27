//文件API请求
import { requestY } from '@/utils/requestY';



// export function uploadFileAPI(data) {
//     return requestY({
//         url: '/file/upload',
//         method: 'POST',
//         data
//     })
// }

export async function uploadFileAPI(formData) {
    // 模拟上传，无需后端，返回本地预览 URL
    return new Promise(resolve => {
        setTimeout(() => {
            const file = formData.get('image');
            const url = URL.createObjectURL(file);
            resolve({ data: { data: url } });
        }, 500);
    });
}