import Taro, {useRouter} from '@tarojs/taro';
import { View, Image, Text} from '@tarojs/components';
import './index.scss';
import React, {useEffect} from "react";


export default function ArticleDetail() {
  const router = useRouter();
  const { id, articleCategory,views,title,articleText, date, image} = router.params;

  const formatTime = (time) => {
    const date = new Date(time);
    return date.toLocaleDateString('zh-CN'); // 使用中文格式的日期，例如2024-06-18
  };


  useEffect(() => {
    if (title) {
      Taro.setNavigationBarTitle({
        title: title
      });
    }
  }, [title]);

  return (
    <View className="article-detail">
      <View className="article-image-out">
        <Image className="article-image" src={image} />
      </View>
      <View className="article-info">
        <Text className="article-title">{title}</Text>
        <View className="article-meta">
          <Text className="article-date">{formatTime(date)}</Text>
          {views && (
            <Text className="article-views">浏览 {views}</Text>
          )}
        </View>
        <Text className="article-content" user-select>
          {articleText}
        </Text>
        <View className="article-container">
          <Text className="article-bot">
            图文内容仅供参考，我司保留法律允许范围内的解释权。
          </Text>
        </View>
      </View>
    </View>
  );
}
