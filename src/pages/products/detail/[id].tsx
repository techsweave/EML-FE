import { Models, Services } from 'utilities-techsweave';
import ProductDetail from '@components/product/detail/ProductDetail';
import Layout from '@components/Layout';
import { GetStaticProps, GetStaticPaths } from 'next';
import RelatedProduct from '@components/product/detail/RelatedProduct/RelatedArticles';
import React from 'react';
import { ConditionExpression } from '@aws/dynamodb-expressions';
import { Flex } from '@chakra-ui/react';

export default function productDetailPage(prop) {
  const { product, RelatedProducts } = prop;
  return (
    <Layout title={product.title}>
      <Flex flexDirection='column' alignSelf="center">
        <ProductDetail product={product} />
        <RelatedProduct product={RelatedProducts} />
      </Flex>
    </Layout>
  );
}
export const getStaticPaths: GetStaticPaths = async () => {
  const caller = new Services.Products(`${process.env.NEXT_PUBLIC_API_ID_PRODUCTS}`, `${process.env.NEXT_PUBLIC_API_REGION}`, `${process.env.NEXT_PUBLIC_API_STAGE}`);
  const id = (await caller.scanAsync(25)).data;
  const paths = id.map((idPath) => ({ params: { id: idPath.id } }));
  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps = async (context) => {
  const caller = new Services.Products(`${process.env.NEXT_PUBLIC_API_ID_PRODUCTS}`, `${process.env.NEXT_PUBLIC_API_REGION}`, `${process.env.NEXT_PUBLIC_API_STAGE}`);
  const product = await caller.getAsync(context.params?.id as string);
  const productId = product.id;
  const category = product.categorieId;
  const filter: ConditionExpression = {
    type: 'And',
    conditions: [
      {
        type: 'NotEquals',
        subject: 'id',
        object: productId,
      },
      {
        type: 'Equals',
        subject: 'categorieId',
        object: category,
      },
    ],
  };
  let RelatedProducts: Models.Tables.IProduct[] = [];
  try {
    RelatedProducts = (await caller.scanAsync(6, undefined, undefined, undefined, filter)).data;
  } catch (error) {
    console.log(error);
  }
  console.log(RelatedProducts);
  return {
    props: {
      product,
      RelatedProducts,
    }, // will be passed to the page component as props
    revalidate: 600,
  };
};
