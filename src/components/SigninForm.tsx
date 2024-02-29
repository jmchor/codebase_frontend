import { useMutation } from '@apollo/client';
import { graphql } from 'gql.tada';
import { useAuth } from '../auth';
import { flushSync } from 'react-dom';
import { useNavigate } from '@tanstack/react-router';
import Form from '../styles/Form';
import { useState } from 'react';
import styled from 'styled-components';
import { NavigationButton } from '../styles/NavbarStyles';

const LOGIN = graphql(`
	mutation Login($credentials: LoginInput!) {
		login(credentials: $credentials) {
			value
			isAuthenticated
		}
	}
`);

const SigninFormWrapper = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	height: 100vh;
`;

const SigninForm: React.FC = () => {
	const [login, { loading, error }] = useMutation(LOGIN);
	const navigate = useNavigate();
	const { setIsLoggedIn } = useAuth();

	const [formData, setFormData] = useState({
		input: '',
		password: '',
	});

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData({
			...formData,
			[name]: value,
		});
	};

	const handleLogin = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			const { data } = await login({
				variables: {
					credentials: formData,
				},
			});

			if (data?.login?.isAuthenticated === true) {
				flushSync(() => {
					setIsLoggedIn(true);
				});
				navigate({ to: '/dashboard' });
			}
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<SigninFormWrapper>
			<Form onSubmit={handleLogin}>
				<label htmlFor='usernameOrEmail'>
					Username or Email:
					<input type='text' id='input' name='input' value={formData.input} onChange={handleInputChange} />
				</label>
				<label htmlFor='password'>
					Password:
					<input type='password' id='password' name='password' value={formData.password} onChange={handleInputChange} />
				</label>

				<button type='submit' disabled={loading}>
					{loading ? 'Logging in...' : 'Login'}
				</button>
			</Form>
			{error ? (
				<p>{error.message}</p>
			) : (
				<p>
					{' '}
					<br />
				</p>
			)}
			<p>No Account Yet?</p>
			<button
				onClick={() => {
					navigate({ to: '/signup' });
				}}
			>
				Sign Up
			</button>
		</SigninFormWrapper>
	);
};

export default SigninForm;
