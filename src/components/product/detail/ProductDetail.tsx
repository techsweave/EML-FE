import { Models, AuthenticatedUser } from 'utilities-techsweave';
import React, { useState, useEffect } from 'react';
import {
  Image, VStack,
  NumberInput, NumberInputField,
  Text, Flex, Grid, GridItem, Heading, HStack, Stack,

} from '@chakra-ui/react';
import { Button } from '@chakra-ui/button';
import { ArrowBackIcon } from '@chakra-ui/icons';
import RelatedProduct from '@components/product/detail/RelatedProduct/RelatedArticles';
import { useSession } from 'next-auth/client';
import Link from 'next/link';
import AddToCart from '../../cart/AddToCart';
import ProductInfo from './ProductInfo';

const ProductDetail = (prop: {
  product: Models.Tables.IProduct,
  category: Models.Tables.ICategory,
  alternativeProduct: Models.Tables.IProduct[]
}) => {
  const { product, category, alternativeProduct } = prop;
  const session = useSession()[0];
  const [userState, setState] = useState<boolean>();
  const [quantityState, setQuantityState] = useState(1);

  const handleChange = (e) => {
    setQuantityState(+e.target.value);
  };

  async function isVendor(s) {
    const user = await AuthenticatedUser.fromToken(s?.accessToken as string);
    return user.isVendor(process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID!);
  }
  useEffect(() => {
    const s = session;
    if (userState !== undefined) return;
    if (!s) return;
    isVendor(s).then(
      (data) => {
        setState(data);
      },
    ).catch(
      (err) => {
        console.log(err.message);
      },
    );
  }, [userState, setState, session]);
  const discountedPrice = (product.price * ((100 - product.discount!) / 100));
  return (
    <Flex w="95%" direction={['column', 'column', 'row', 'row']} alignSelf="center">
      <Grid row='2' column='1' w='100%'>
        <Link href={userState ? { pathname: '/editProduct/[id]', query: { id: product.id } } : '/products'}>
          <Button mb='5' w='100px' mt='2' leftIcon={<ArrowBackIcon />} bg='gray.100'>BACK</Button>
        </Link>
        <GridItem>
          <Flex direction={['column', 'column', 'row', 'row']} alignSelf="center">
            <Image src={product.imageURL} fallbackSrc='/images/fallback.jpg' alt={product.title} w="500px" h="300px" borderRadius="15px" objectFit='scale-down' />
            <VStack flexBasis="50%" alignSelf="center" ml={['2', '2', '12', '12']} mr={['2', '2', '5', '5']} mb={['7', '7', '0', '0']}>
              <Heading as="h2" mb='3' mt='5'>
                {product.title}
              </Heading>
              <Text textAlign='justify'>
                {product.description}
              </Text>
            </VStack>
            <VStack ml={['0', '0', '10', '10']} alignSelf="center">
              <Text
                color='gray.700'
                fontSize='xl'
              >
                {(product.discount ? discountedPrice : product.price)?.toFixed(2).toString().concat(' €')}
              </Text>
              <Text
                color='gray.500'
              >
                <Text
                  as='del'
                >
                  {product.discount ? product.price?.toFixed(2).toString().concat('€') : undefined}
                </Text>

                {' '.concat(
                  product.discount
                    ? product.discount?.toString().concat('%')
                    : '',
                )}
              </Text>
              <Text textAlign='center'>
                Taxes:
                {' '}
                {product.discount ? (discountedPrice * (category.taxes! / 100)).toFixed(2)
                  : (product.price! * (category.taxes! / 100)).toFixed(2)}
                {' '}
                €
                -
                {' '}
                {category.taxes!}
                %
              </Text>
              <HStack hidden={userState}>
                <Text>
                  Quantity
                </Text>
                <NumberInput defaultValue={1} min={1} max={product.availabilityQta}>
                  <NumberInputField name='quantity' id='quantity' value={quantityState} onChange={handleChange} w='20' />
                </NumberInput>
              </HStack>
              <Text>
                Max Qty:
                {' '}
                {product.availabilityQta}
              </Text>
              {userState ? undefined : <AddToCart product={product} quantity={quantityState} />}
            </VStack>
          </Flex>
        </GridItem>
        <GridItem>
          <Stack mt='7' display={['none', 'none', 'inherit', 'inherit']}>
            <Text fontWeight='bold' fontSize='4xl' mb='5'>Product&apos;s details</Text>
            <ProductInfo product={product} />
          </Stack>
        </GridItem>
        <GridItem>
          {userState ? undefined : <RelatedProduct product={alternativeProduct} />}
        </GridItem>
      </Grid>
    </Flex>
  );
};

export default ProductDetail;
