import Layout from '../../components/Layout'
import ProductList from '../../components/ProductList'
import product from '../../types/product'

const alltheprods: product[] = [{ id: 1, name: 'cucchiaio', description: 'resistente cucchiaio in acciaio', price: 10, quantity: 20 },
  { id: 2, name: 'siringa', description: 'ottima siringa', price: 1, quantity: 2 },
  { id: 3, name: 'accendino', description: 'potente accendino', price: 2000, quantity: 1 }]

export default function productPage () {
  return (
        <Layout title="Product-page">
            <ProductList productlist={alltheprods} />
        </Layout>
  )
}
