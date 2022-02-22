import styles from './index.less';
import {history} from 'umi'
export default function IndexPage() {
  return (
    <div>
      <h1 className={styles.title}>前端example项目</h1>
      <button onClick={()=>history.push('/dnd-kit/grid')}>拖拽排序</button>
    </div>
  );
}
