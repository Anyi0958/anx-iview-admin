// export default url => () => import(`@/views/${url}.vue`);

export default url => resolve => require([`@/views/${url}.vue`], resolve);

// ԭ��webpack �汾���⣬webpack4�ж�̬import��֧�ֱ�����ʽ
