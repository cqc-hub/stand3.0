import { useMessageStore } from '@/stores/modules/globalMessage';

type GreaterThan<
	T extends number,
	U extends number,
	R extends any[] = []
> = T extends R['length']
	? false
	: U extends R['length']
	? true
	: GreaterThan<T, U, [...R, 1]>;

type TChooseImgBase64Res =
	| {
			success: true;
			base64: string;
	  }
	| {
			success: false;
			evt: any;
	  };

const wxDownFileToLocal = function (url: string): Promise<string> {
	return new Promise((resolve, reject) => {
		wx.downloadFile({
			url,
			success(e) {
				const { tempFilePath } = e;
				resolve(tempFilePath);
			},

			fail(e) {
				reject(e);
			}
		});
	});
};

const getWeChatBase64ImageByUrl = function (
	url: string
): Promise<TChooseImgBase64Res> {
	return new Promise(async (r, j) => {
		// 确认是本地是还是网络的url
		if (url.startsWith('http')) {
			const _url = await wxDownFileToLocal(url);

			if (_url) {
				url = _url;
			}
		}

		wx.getFileSystemManager().readFile({
			filePath: url, //选择图片返回的相对路径
			encoding: 'base64', //编码格式
			success: ({ data }) => {
				r({
					success: true,
					base64: data
					// base64: 'data:image/jpg;base64,' + data
				});
			},
			fail: (evt) => {
				j({
					success: false,
					evt
				});
			}
		});
	});
};

const checkFileSize = ({
	filePath,
	fileSize
}: {
	filePath: string;
	fileSize: number;
}) => {
	const messageStore = useMessageStore();

	return new Promise((resolve, reject) => {
		uni.getFileInfo({
			filePath,
			fail: reject,
			complete: (res) => {
				const { size } = res;

				if (size < fileSize) {
					resolve(res);
				} else {
					// showMessage('请选择小于 2M 的相片');
					const str = `请选择小于 ${(fileSize / 1024 / 1024).toFixed(
						1
					)}M 的相片`;
					messageStore.showMessage(str);
					reject(str);
				}
			}
		});
	});
};

// 获取 base64
export const chooseImg = (
	payload: Partial<{
		extension: ('jpg' | 'jpeg' | 'image')[];
		fileSize?: number;
	}> = {}
): Promise<TChooseImgBase64Res> => {
	const { extension, fileSize } = payload;

	return new Promise((resolve, reject) => {
		uni.chooseImage({
			extension,
			count: 1,
			sizeType: 'compressed',
			async success(e) {
				const { tempFilePaths, tempFiles } = e;

				if (tempFilePaths.length) {
					if (fileSize) {
						await checkFileSize({
							filePath: tempFilePaths[0],
							fileSize
						});
					}

					// #ifdef MP-WEIXIN
					return resolve(
						await getWeChatBase64ImageByUrl(tempFilePaths[0])
					);
					// #endif

					reject({
						success: false,
						evt: '当前只有微信'
					});
				} else {
					reject({
						success: false,
						evt: '获取图片失败'
					});
				}
			},

			fail() {}
		});
	});
};

export const useOcr = async () => {
	const messageStore = useMessageStore();
	try {
		const e = await chooseImg({
			extension: ['image', 'jpeg', 'jpg'],
			fileSize: 2 * 1024 * 1024
		});

		if (e.success) {
			e.base64;
		} else {
			throw new Error(e.evt);
		}
	} catch (error) {
		messageStore.showMessage(error as string);
	}
};
